Class('MediaOverlay').inherits(Widget)({
    prototype : {
        /**
         * Holds the url template for facebook share.
         * @property FACEBOOK_URL_BASE <private> [String]
         */
        FACEBOOK_URL_BASE : "http://facebook.com/sharer.php?",

        /**
         * Holds the twitter url template.
         * @property TWITTER_URL_BASE <private> [String]
         */
        TWITTER_URL_BASE : "http://twitter.com/intent/tweet?",

        /**
         * Embedly regular expression.
         * @property RE_EMBEDLY <private> [RegExp]
         */
        RE_EMBEDLY : null,

        overlay : null,
        customName : null,
        animationSpeed : 400,
        timeoutRequest : null,
        _carouselWrapper : null,
        _nextArrowElement : null,
        _prevArrowElement : null,
        _closeButtonElement : null,
        _titleElement : null,
        _sourceTypeIcon : null,
        _timeAgoElement : null,
        _imageWrapper : null,
        _facebookButtonElement : null,
        _twitterButtonElement : null,
        _flagButtonElement : null,
        _document : null,

        _prevVoiceElementData : null,
        _nextVoiceElementData : null,

        init : function init(config) {
            Widget.prototype.init.call(this, config);

            this._document = $(document);
            this.overlay = this.element.find('.cv-overlay-backdrop.cv-media-gallery');
            this.customName = this.element.data('custom-name');
            this._carouselWrapper = this.element.find('.cv-media-gallery-carrousel');
            this._nextArrowElement = this.element.find('.voice-arrow.next');
            this._prevArrowElement = this.element.find('.voice-arrow.prev');
            this._closeButtonElement = this.element.find('.js-back-to-voice-button');
            this._titleElement = this.element.find('.title');
            this._sourceTypeIcon =  this.element.find('.time-ago > i');
            this._timeAgoElement =  this.element.find('.time-ago > span');
            this._imageWrapper = this.element.find('.image-wrapper');
            this._facebookButtonElement = this.element.find('.actions .facebook');
            this._twitterButtonElement = this.element.find('.actions .twitter');
            this._flagButtonElement = this.element.find('.flag-div .flag');

            this._createEmebdlyRe()._bindEvents();
        },

        _createEmebdlyRe : function _createEmebdlyRe() {
            var re, extendRe, finalRe;

            re = window.embedlyURLre.source;
            extendRe = "|(:?.*\\.(jpe?g|png|gif)(:?\\?.*)?$))";
            finalRe = re.substring(0, re.length - 1) + extendRe;

            this.constructor.RE_EMBEDLY = new RegExp(finalRe, 'i');

            return this;
        },

        _bindEvents : function _bindEvents() {
            this._closeButtonElement.bind('click', this.deactivate.bind(this));
            this._prevArrowElement.bind('click', this._prevArrowClickHandler.bind(this));
            this._nextArrowElement.bind('click', this._nextArrowClickHandler.bind(this));

            return this;
        },

        /**
         * Handle the next arrow button click event.
         * @method _nextArrowClickHandler <private> [Function]
         */
        _nextArrowClickHandler : function _nextArrowClickHandler() {
            if (this._nextVoiceElementData) {
                return this.updateWith(this._nextVoiceElementData);
            }
        },

        /**
         * Handle the prev arrow button click event.
         * @method _prevArrowClickHandler <private> [Function]
         */
        _prevArrowClickHandler : function _prevArrowClickHandler() {
            if (this._prevVoiceElementData) {
                return this.updateWith(this._prevVoiceElementData);
            }
        },

        createCarrousel : function createCarrousel(voiceElementData) {
            var voiceElements = voiceElementData.getSiblingsBySourceType(['image', 'video']);

            if (this.carousel) {
                this.carousel.destroy();
            }

            this.appendChild(new MediaOverlayCarousel({
                name : 'carousel'
            })).addThumbnails(voiceElements).render(this._carouselWrapper);

            return this;
        },

        /**
         * Rebuild the overlay itself with the passed voice data.
         * @method updateWith <public> [Function]
         * @argument voiceElement <required> [Object]
         * @return this [MediaOverlay]
         */
        updateWith : function updateWith(voiceElement) {
            var currentThumb;

            this.overlay.show();

            currentThumb = this.carousel.getCurrent(voiceElement);

            this._prevVoiceElementData = voiceElement.getPreviousSiblingBySourceType(['image', 'video']);
            this._nextVoiceElementData = voiceElement.getNextSiblingBySourceType(['image', 'video']);

            this.carousel.deactivateAll();
            currentThumb.activate();

            this._updateDynamicSources(voiceElement);
            this._updateArrowState();

            this.timeoutRequest = window.setTimeout(function() {
                $.post('/notify_js_error', {
                    e : 'There were a problem loading an embedly resource.',
                    data : voiceElement
                }, function(data) {
                    console.error(data);
                });
            }, 60000);
            
            $.embedly(voiceElement.postURL, {
                key : '7a45bbf49862423380410598ebf08688', /* TODO: Use Esra'a key */
                maxWidth : parseInt($(document).width() * 0.80),
                maxHeight : parseInt($(window).height() * 0.80),
                secure : true,
                urlRe : this.constructor.RE_EMBEDLY
            }, this._embedlyCallbackHandler.bind(this));

            this.element.slideDown(this.animationSpeed, function() {
                this.carousel.scrollToChild(currentThumb);
                this.activate();
            }.bind(this));

            return this;
        },

        _embedlyCallbackHandler : function _embedlyCallbackHandler(oembed) {
            var secure_url;
            window.clearTimeout(this.timeoutRequest);

            var maxHeight = this.element.find('.cv-media-gallery-wrapper').height();

            if (oembed.html) {
                this._imageWrapper.html(oembed.html);
            } else {
                secure_url = oembed.url.replace('http:', 'https:');

                if (oembed.type == 'link' && oembed.width == undefined) {
                    this._imageWrapper.html('\
                        <a href="' + secure_url + '">\
                            <img src="' + oembed.thumbnail_url + '" width="' + oembed.thumbnail_width + '" height="' + oembed.thumbnail_height + '" />\
                        </a>');
                } else {
                    this._imageWrapper.html('<img src="' + secure_url + '" style="max-height: ' + parseInt($(window).height() * 0.80) +'px;"/>');
                }
            }

            this.overlay.hide();
        },

        /**
         * Updates some dynamic information from the ui, such as the social
         * buttons, the title url and the flag button.
         * @property _upadteDynamicSouces <private> [Function]
         * @return this [MediaOverlay]
         */
        _updateDynamicSources : function _updateDynamicSources(voiceElement) {
            this._sourceTypeIcon.removeClass(function (index, css) {
                return (css.match (/(^|\s)icon-\S+/g) || []).join(' ');
            }).addClass('icon-' + voiceElement.sourceType);

            this._facebookButtonElement[0].href = this.FACEBOOK_URL_BASE + "u=" + voiceElement.URL;
            this._twitterButtonElement[0].href = this.TWITTER_URL_BASE + "text=" + encodeURIComponent(voiceElement.title) + "&url=" + voiceElement.URL + "&via=" + this.customName;
            this._flagButtonElement[0].href = "/" + window.currentVoice.slug + "/posts/" + voiceElement.id + "/votes.json?rating=" + (voiceElement.sourceElement.data('voted') ? 1 : -1);

            this._timeAgoElement.text(voiceElement.timeAgo);
            this._titleElement.text(voiceElement.title);

            this._flagButtonElement.unbind('click').bind('click', function() {
                $.ajax({
                    url : this._flagButtonElement[0].href,
                    data : $.extend({ authenticity_token : $('meta[name=csrf-token]').attr('content')}, $(this).data('params')),
                    type : 'POST',
                    dataType : 'json',
                    context : this,
                    success: function (data) {
                        if (this._flagButtonElement.hasClass('flag')) {
                            this._flagButtonElement.siblings().find('.flag-tooltip span').addClass('flagged').html('Unflag Content');
                            this._flagButtonElement.toggleClass('flag flag-pressed')
                                .attr('href', [this._flagButtonElement.attr('href').split('?')[0], 'rating=1'].join('?'));
                        } else {
                            this._flagButtonElement.siblings().find('.flag-tooltip span').removeClass('flagged').html('Flag Inappropiate Content');
                            this._flagButtonElement.toggleClass('flag flag-pressed')
                                .attr('href', [this._flagButtonElement.attr('href').split('?')[0], 'rating=-1'].join('?'));
                        }
                    }
                });

                return false;
            }.bind(this));

            return this;
        },

        /**
         * Show or hide the next/prev navigation arrows.
         * @method _updateArrowState <private> [Function]
         * @return this [MediaOverlay]
         */
        _updateArrowState : function _updateArrowState() {
            if (this._prevVoiceElementData) {
                this._prevArrowElement[0].title = this._prevVoiceElementData.title;
                this._prevArrowElement.show();
            } else {
                this._prevArrowElement.hide();
            }

            if (this._nextVoiceElementData) {
                this._nextArrowElement[0].title = this._nextVoiceElementData.title;
                this._nextArrowElement.show();
            } else {
                this._nextArrowElement.hide();
            }

            return this;
        },

        _keyUpHandler : function _keyUpHandler(ev) {
            if (ev.keyCode == 27) { /* ESC */
                return this.deactivate();
            }

            if (ev.keyCode == 37) { /* prev */
                this._prevArrowClickHandler();
            }

            if (ev.keyCode == 39) { /* next */
                this._nextArrowClickHandler();
            }
        },

        _activate : function _activate () {
            Widget.prototype._activate.call(this);

            this._document.unbind('keydown.bg').bind('keydown.bg', function(ev) {
                ev.preventDefault();
            });

            this._document.unbind('keyup.bg').bind('keyup.bg', this._keyUpHandler.bind(this));
        },

        _deactivate : function _deactivate() {
            Widget.prototype._deactivate.call(this);

            this._document.unbind('keyup.bg');
            this._document.unbind('keydown.bg');

            this.element.slideUp(this.animationSpeed, function() {
                this._imageWrapper.empty();
            }.bind(this));

            return this;
        }
    }
});
