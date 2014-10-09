Class('Overlay')({
    prototype: {
        init: function (element, options) {
            this.options = {
                overlay : '#overlay',
                overlayContainer : '.overlay-container',
                linkOverlayContainer : '.link-overlay',
                arrows : '.arrows',
                closeBtn : '.close-voice-container',
                content : { }
            };
            $.extend(this.options, options);
            this.overlay = $(this.options.overlay);
            this.overlayContainer = $(this.options.overlayContainer);
            this.linkOverlayContainer = $(this.options.linkOverlayContainer);
            this.overlayTemplate = this.overlayContainer.html();
            this.linkOverlayTemplate = this.linkOverlayContainer.html();
            this.win = $(window);
            this.body = $('body');
            this._elementSelector = element;
            this._initZeroClipboard();
            this._bindEvents();
            this._alignMagnifier();
        },

        _initZeroClipboard: function() {
            var that = this;
            ZeroClipboard.setMoviePath( '/javascripts/ZeroClipboard10.swf' );
            this.zeroclip = new ZeroClipboard.Client();
            this.zeroclip.addEventListener('onMouseDown', function() {
              that.zeroclip.setText( $('.link-overlay iframe').attr('src') );
            });
            this.zeroclip.addEventListener('complete',function(client,text) {
              alert('copied!');
            });
        },

        unbindEvents: function(){
            this.element.find('.voice-cont').unbind('click');
            this.element.find('.comments').unbind('click');
            return this;
        },

        bindEvents: function(){
            var that = this;
            this.element = $(this._elementSelector);
            this.element.find('.voice-cont').live('click', function () {
                that.buildOverlay($(this).find('.source-url'));
                return false;
            });

            this.element.find('.comments').live('click', function () {
                that.buildOverlay($(this).parent().prev().find('.source-url'));
                return false;
            });
        },

        _bindEvents: function () {
            var that = this;

            this.bindEvents();

            $(this.options.closeBtn).live('click', function () {
                that.hide();
                return false;
            });

            this.overlay.click(function () {
                that.hide();
            });

            this.body.bind('keydown', function (ev) {
                if(ev.keyCode == 27 && that.visible) {
                    that.hide();
                }
            });

            $('.voice-cont').css('margin-top', '0', 'margin-left', '0');

            if (!window.isDevice) {
                $('.voice-arrow').live('mouseover', function () {
                    $(this).next('.tooltip-arrow').show();
                }).live('mouseout', function () {
                    $(this).next('.tooltip-arrow').hide();
                });
            }

            $('.voice-arrow').live('click', function () {
                that.buildOverlay($('.source-url.post-' + $(this).data('id')));
                return false;
            });

            $('.back-to-voice span').live('click', function () {
                that._hideLinkOver();
            });
        },

        _showLinkOver: function () {
            var that = this
            this.linkOverlayContainer.delay(200).slideDown(function (){
                that.zeroclip.glue('d_clip_button', 'd_clip_container');
                $('.copy-url div').hover(
                  function () {
                    $(this).css('cursor', 'pointer');
                    $(this).prev('a').addClass('clipboard-btn');
                  },
                  function () {
                    $(this).prev('a').removeClass('clipboard-btn');
                  }
                );
            });

        },

        _hideLinkOver: function (callback) {
            this.linkOverlayContainer.slideUp('1000');
            if ( $.isFunction(callback) ) callback();
        },

        _alignMagnifier: function () {
            this.element.each(function() {
                var hover = $(this).children().children().children('span'),
                    imageHeight = $(this).find('.thumb-preview').height(),
                    imageWidth = $(this).find('.thumb-preview').width();
                hover.css({
                    'margin-top' : ( imageHeight / 2 ) - 21,
                    'margin-left' : ( imageWidth / 2 ) - 21
                });
            });
        },

        _getData: function(e) {
            var data = {},
                index = $('.voice-box:not(.isotope-hidden)').index(e.closest('.voice-box')),
                prev = $('.voice-box:not(.isotope-hidden):lt('+index+')').last(),
                next = $('.voice-box:not(.isotope-hidden):gt('+index+')').first();

            data.title = e.data('title');
            data.ago = e.data('ago');
            data.href = e.attr('href');
            data.voice_slug = window.currentVoice.slug;
            data.post_id = e.data('id');
            data.type = e.data('type');
            data.permalink = e.data('permalink');
            data.voted = e.data('voted');
            data.service = e.data('service');

            if(prev.length) {
                data.prev = {
                    image: prev.find('.voice-cont > a > img').attr('src'),
                    title: prev.find('.voice-cont > a').data('title'),
                    id: prev.find('.voice-cont > a').data('id')
                };
            }
            if(next.length) {
                data.next = {
                    image: next.find('.voice-cont > a > img').attr('src'),
                    title: next.find('.voice-cont > a').data('title'),
                    id: next.find('.voice-cont > a').data('id')
                };
            }
            return data;
        },

        buildOverlay: function (e) {
            var data = this._getData(e);
            this.showTopOverlay();
            this._replaceContent(data);
        },

        _replaceContent: function (data) {
            var content = unescape(data.type == 'link' ? this.linkOverlayTemplate : this.overlayTemplate),
                that = this,
                width = 0,
                maxWidth = parseInt($(document).width() * 0.80),
                maxHeight = parseInt($(window).height() * 0.80) - 150;

            content = content.replace(/{{title}}/g, data.title);
            content = content.replace(/{{escaped_title}}/g, encodeURIComponent(data.title));
            content = content.replace(/{{time_ago}}/g, data.ago);
            content = content.replace(/{{source_url}}/g, data.href);
            content = content.replace(/{{voice_slug}}/g, data.voice_slug);
            content = content.replace(/{{post_id}}/g, data.post_id);
            content = content.replace(/{{rating}}/g, data.voted ? 1 : -1);

            if(data.type == 'link') {
                this.hide();
                this._onContentLoaded(content, $(document).width(), data);
            } else {
                this.timeoutRequest = setTimeout(function(){
                    $.post('/notify_js_error', { e: 'There were a problem loading an embedly resource.', data: data }, function(data) {
                    });
                }, 60000);

                $.embedly(data.href, {
                        key: '7a45bbf49862423380410598ebf08688', // TODO: Use Esra'a key
                        maxWidth: maxWidth,
                        maxHeight: maxHeight,
                        secure: true,
                        urlRe: new RegExp(window.embedlyURLre.source.substring(0, embedlyURLre.source.length-1) + "|(:?.*\\.(jpe?g|png|gif)(:?\\?.*)?$))", 'i')
                    }, function(oembed, dict){
                    clearTimeout(that.timeoutRequest);

                    if(oembed.html) {
                        content = content.replace(/{{content}}/g, oembed.html);
                        width = oembed.width;
                    } else {
                        var url_ssl = oembed.url.replace('http:', 'https:');

                        if (oembed.type == 'link' && oembed.width == undefined){
                            content = content.replace(/{{content}}/g, '<a href="' + url_ssl + '"><img src="' + oembed.thumbnail_url + '" width="' + oembed.thumbnail_width + '" height="' + oembed.thumbnail_height + '" /></a>');
                             width = oembed.thumbnail_width;
                        } else {
                            content = content.replace(/{{content}}/g, '<img src="' + url_ssl + '" style="max-height: '+ maxHeight +'px" />');
                             width = Math.round((oembed.width/oembed.height) * maxHeight);

                             if (data.service == 'Flickr'){
                                 width = oembed.width;
                             }
                        }
                    }

                    if (width < 310) {
                        width = 310;
                    }

                    that._onContentLoaded(content, width, data);
                });
            }
        },

        _onContentLoaded: function (content, width, data) {
            var that = this;

            content = content.replace(/{{content_width}}/g, width-11);
            content = content.replace(/{{voice_width}}/g, width);
            content = content.replace(/{{post_permalink}}/g, data.permalink);
            if(data.prev) {
                content = content.replace(/{{prev_title}}/g, data.prev.title);
                content = content.replace(/{{prev_id}}/g, data.prev.id);
                content = content.replace(/{{prev_image}}/g, '<img src="' + data.prev.image + '" width="61">');
            }
            if(data.next) {
                content = content.replace(/{{next_title}}/g, data.next.title);
                content = content.replace(/{{next_id}}/g, data.next.id);
                content = content.replace(/{{next_image}}/g, '<img src="' + data.next.image + '" width="61">');
            }

            $('.overlay-vote-post').unbind('click');
            content = this.update_flag_status($(content), data.voted);

            if (data.type == 'link') {
                if(this.zeroclip) {
                    this.zeroclip.destroy();
                }
                this.linkOverlayContainer.html('').append(content);
                this.linkOverlayContainer.find('iframe').attr('src', data.href);
            } else {
                this.overlayContainer.html('').append(content);
            }

            new Votes('.overlay-vote-post');

            if (!data.prev) {
                this.linkOverlayContainer.find('.arrows .prev').remove();
                this.overlayContainer.find('.arrows.prev').remove();
            }

            if (!data.next) {
                this.linkOverlayContainer.find('.arrows .next').remove();
                this.overlayContainer.find('.arrows.next').remove();
            }

            if (data.type == 'link') {
                this._showLinkOver();
            } else {
                this._hideLinkOver(function() {
                    if (data.type == 'image'){
                        that.overlayContainer.find('.voice-over-info > div > img').imagesLoaded(function (e) {
                            // reset the Image container to take the same width of the image
                            that.show();
                            that.imagePositioning(this);
                            that.updatePosition();
                        });
                    } else {
                        // is video
                        that.show();
                    }
                });
            }

            this.win.bind('resize.overlay', function() {
                that.updatePosition();
            });
        },

        imagePositioning : function(image) {
            var image = $(image);
            if ( $('.voice-container .voice-over-info img').length > 0 ) {
                var ImgElement = image,
                    imgWidth = image.width();

                if ( imgWidth < 310 ) {
                    $(ImgElement).closest('.voice-container').css({width: 310});
                } else {
                    $(ImgElement).closest('.voice-container').css({width: imgWidth}).addClass('imgContainerWidth');
                }
            }
        },

        showTopOverlay: function () {
            this.overlay.css('top', $(document).scrollTop()).fadeIn();
        },

        update_flag_status: function (ele, voted){
            if (voted == true){
                ele.find('.flag-div a').toggleClass('flag flag-pressed');
                ele.find('.flag-tooltip span').html('Unflag Content');
            }
            return ele;
        },

        updatePosition : function updatePosition() {
            var top = (this.win.height() - this.overlayContainer.height()) / 2,
                left = (this.win.width() - this.overlayContainer.width()) / 2,
                arrowPosition = ((this.overlayContainer.height() / 2) - 30);

            this.overlayContainer.css({
                'top': top + $(document).scrollTop(),
                'left': left
            });

            $(this.options.arrows).css({
                'margin-top': arrowPosition
            });
        },

        show: function () {
            if (this.overlay.is(':visible')) {
                this.updatePosition();
                this.body.addClass('avoid-scrolling-content');
                this.overlayContainer.show();

                this.visible = true;
            } else {
                return false;
            }
        },

        hide: function () {
            this.win.unbind('resize.overlay');
            this.body.removeClass('avoid-scrolling-content');
            $('.voice-over-info object, .voice-over-info iframe').remove();
            this.overlay.fadeOut('slow');
            this.overlayContainer.fadeOut('slow');
            this.visible = false;
        }
    }
});
