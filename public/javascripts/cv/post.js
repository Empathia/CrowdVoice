Class('Post').inherits(Widget)({
    RE_VIDEO : new RegExp("^https?:\\/\\/(?:www\\.)?(youtube\\.com\\/watch\\?.*v=[^&]|vimeo\\.com\\/(?:.*#)?(\\d+))", "i"),
    RE_IMAGE : new RegExp("^https?:\\/\\/(?:www\\.)?(flickr\\.com\\/photos\\/[-\\w@]+\\/\\d+|twitpic\\.com\\/[^\\/]+$|yfrog\\.com\\/[^\\/]+$|.*\\/.*\\.(jpe?g|png|gif)(?:\\?.*)?$)", "i"),
    RE_LINK : new RegExp("^https?:\\/\\/([\\w-]+\\.([\\w-]+)){1,}([\\/?#].*)?$", "i"),

    prototype: {
        carousel : null,
        postFilter : null,

        postPlaceHolder : null,
        inputPost : null,
        inputFile: null,
        form : null,
        _keyupTimer : null,

        imageMediaTool : null,
        videoMediaTool : null,
        linkMediaTool : null,
        _remoteImageUrl : null,

        _lastSearch : null,

        init: function (config) {
            Widget.prototype.init.call(this, config);

            this.postPlaceHolder = this.element.find('.post-paceholder');
            this.inputPost = this.element.find('#post_source_url');
            this.inputFile = this.postPlaceHolder.find('input');
            this.form = this.element.parent();
            this._lastSearch = '';

            this.imageMediaTool = new MediaTool({
                element : this.element.find('.media.tool-image')
            }).showTooltipDefaultContent();

            this._remoteImageUrl = this.imageMediaTool.getTooltip().element.find('#post_remote_image_url');

            this.videoMediaTool = new MediaTool({
                element : this.element.find('.media.tool-video')
            })

            this.linkMediaTool = new MediaTool({
                element : this.element.find('.media.tool-link')
            }).showTooltipDefaultContent();

            this.carousel = new Carousel({
                element : this.linkMediaTool.getElement().find('.cv-carousel-widget')
            });

            this._bindEvents();
        },

        _showTooltip : function _showTooltip(type) {
            $('.tooltip.notice').hide();
            this._remoteImageUrl.val('');
            this.carousel.clear();

            this.imageMediaTool.deactivate();
            this.videoMediaTool.deactivate();
            this.linkMediaTool.deactivate();

            if (type === 'video') {
                return this.videoMediaTool.activate().getTooltip().deactivate();
            }

            if (type === 'image') {
                this.imageMediaTool.activate();
                $('#image_description').val('');
                $('#image_title').val('');
                $('#post_copyright').val('');
            }

            if (type === 'link') {
                this.linkMediaTool.activate();
                this.carousel.showLoader();
                this.carousel.show();
                this._call_for_page_info();
            }

            if (this.inputPost.val() !== ''){
                if (type === 'image') {
                    this.imageMediaTool.showTooltipDynamicContent();
                }

                if (type === 'link') {
                    this.linkMediaTool.showTooltipDynamicContent();
                }
            }

            return this;
        },

        _bindEvents: function () {
            var that = this;

            that.postPlaceHolder.children('span').bind('click', function () {
                that.inputPost.focus();
            });

            that.inputPost.bind('focus', function () {
                that.postPlaceHolder.hide();
            });

            that.inputPost.bind('blur', function (event) {
                if (that.inputPost.val() === "") {
                    that.postPlaceHolder.show();
                    that.imageMediaTool.showTooltipDefaultContent();
                    that.linkMediaTool.showTooltipDefaultContent();
                }
            });

            that.inputFile.bind('change', function () {
                var fileValue = $(this).val();
                if(fileValue) {
                    that.postPlaceHolder.hide();
                    fileValue = fileValue.split("\\");
                    fileValue = fileValue[fileValue.length - 1];
                    that.inputPost.val(fileValue);
                    that._showTooltip('image');
                }
            });

            that.inputPost.bind('keyup', function (e) {
                if (that._keyupTimer) window.clearTimeout(that._keyupTimer);

                that._keyupTimer = window.setTimeout(function() {
                    if ((e.which <= 90 && e.which >= 48 && e.which != 86) || e.which == 8) {
                        that._showTooltip(that._detectUrl(that.inputPost.val()));
                    }

                    window.clearTimeout(that._keyupTimer);
                }, 500);
            });

            that.inputPost.bind('paste',function () {
                setTimeout(function() {
                    that._showTooltip(that._detectUrl(that.inputPost.val()));
                }, 250);
            });

            that.form.submit(that._submitFormHandler.bind(this));
        },

        _submitFormHandler : function _submitFormHandler(event) {
            var that, inputValue;

            event.preventDefault();

            that = this;
            inputValue = that.inputPost.val();

            if (!inputValue) {
                return false;
            }

            if (that._lastSearch === inputValue) {
                return false;
            }

            if (that._detectUrl(that.inputPost.val()) || that.inputFile.val()) {
                that.form.ajaxSubmit({
                    dataType : 'json',
                    type : 'post',
                    success : function (data) {
                        if (data.post) {
                            that._lastSearch = that.inputPost.val();
                            that.inputFile.val('');
                            that.inputPost.val('').blur();

                            var post = {}

                            post.name          = 'post_' + data.post.id,
                            post.id            = data.post.id,
                            post.image         = data.post.image,
                            post.approved      = data.post.approved,
                            post.description   = CV.getExcerpt(data.post.description, 250),
                            post.imageWidth    = data.post.image_width,
                            post.imageHeight   = data.post.image_height,
                            post.negativeVotes = data.post.negative_votes_count,
                            post.positiveVotes = data.post.positive_votes_count,
                            post.overallScore  = data.post.overall_score,
                            post.sourceService = data.post.source_service,
                            post.sourceType    = data.post.source_type,
                            post.sourceURL     = data.post.source_url,
                            post.title         = data.post.title,
                            post.voiceID       = data.post.voice_id,
                            post.timeAgo       = data.post.created_at,
                            post.createdAt     = data.post.created_at,
                            post.service       = data.post.source_url,
                            post.disabled      = true,
                            post.active        = false,
                            post.tags          = []

                            var voice = new VoiceElement(post);

                            CV.voicesContainer.preloadedVoices.unshift(voice);
                            CV.voicesContainer.appendChild(voice);

                            voice.render(CV.voicesContainer.element, CV.voicesContainer.element.find('.voice-box').first());

                            voice.activate();

                            voice.setImage();

                            CV.voicesContainer.element.isotope('prepended', voice.element[0]);

                            that.imageMediaTool.deactivate();
                            that.videoMediaTool.deactivate();
                            that.linkMediaTool.deactivate();

                            that.postFilter.toggleModerator(true);
                            that.carousel.clear();

                            // TODO: show tooltip confirmation
                        } else { //error -- doesn't work with $.ajax error callback
                            for(var error in data) {
                                that.imageMediaTool.deactivate();
                                that.videoMediaTool.deactivate();
                                that.linkMediaTool.deactivate();

                                if (data.hasOwnProperty(error) && error == 'source_url') {
                                    $('.tooltip.notice .moderate-tooltip').html('Url '+data[error]);
                                    $('.tooltip.notice').show();
                                }
                            }
                        }
                    }
                });
            }
        },

        _detectUrl : function _detectUrl(url) {
            if (this.constructor.RE_VIDEO.test(url)) {
                return 'video';
            }

            if (this.constructor.RE_IMAGE.test(url)) {
                return 'image';
            }

            if (this.constructor.RE_LINK.test(url)) {
                return 'link';
            }

            return false;
        },

        _call_for_page_info: function(){
            var that = this;

            $.ajax({
                url: "/remote_page_info",
                type: 'POST',
                data: "url=" + encodeURIComponent(this.inputPost[0].value),
                dataType: "json",
                success: function(data, status, xhr) {
                    that.carousel.loadHash(data);
                    that.carousel.hideLoader();

                    // wait a bit before doing another ajax call
                    setTimeout(function() {
                        ajaxBusy = false;
                    }, 2000);
                },
                error: function() {
                    // TODO: What to do when fail
                    console.log('ERROR getting info')
                }
            });
        }
    }
});

