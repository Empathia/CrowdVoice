Class('LinkOverlay').inherits(Widget)({
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

        customName : null,
        animationSpeed : 400,
        _nextArrowElement : null,
        _prevArrowElement : null,
        _closeButtonElement : null,
        _sourceButtonElement : null,
        _facebookButtonElement : null,
        _twitterButtonElement : null,
        _flagButtonElement : null,
        _iframeElement : null,
        _document : null,
        _onboardingTooltip : null,
        _onboardingCookie : 'link-overlay-navigation',

        _prevVoiceElementData : null,
        _nextVoiceElementData : null,
        _clip : null,
        _clipGlued : false,

        init : function init(config) {
            Widget.prototype.init.call(this, config);

            this._document = $(document);
            this.customName = this.element.data('custom-name');
            this._nextArrowElement = this.element.find('.voice-arrow.next');
            this._prevArrowElement = this.element.find('.voice-arrow.prev');
            this._closeButtonElement = this.element.find('.js-back-to-voice-button');
            this._sourceButtonElement = this.element.find('.js-link-gallery-source-button');
            this._iframeElement = this.element.find('iframe');
            this._facebookButtonElement = this.element.find('.actions .facebook');
            this._twitterButtonElement = this.element.find('.actions .twitter');
            this._flagButtonElement = this.element.find('.flag-div .flag');

            this._setupCopyToClipbard()._bindEvents()._checkOnboarding();
        },

        /**
         * Instatiate ZeroClipboard, so later it can be used to copy the "source url".
         * @method _setupCopyToClipbard <private> [Function]
         * @return this [LinkOverlay]
         */
        _setupCopyToClipbard : function _setupCopyToClipbard() {
            ZeroClipboard.setMoviePath( '/javascripts/ZeroClipboard10.swf' );
            this._clip = new ZeroClipboard.Client();
            this._clip.setText('');

            return this;
        },

        _bindEvents : function _bindEvents() {
            this._closeButtonElement.bind('click', this.deactivate.bind(this));
            this._prevArrowElement.bind('click', this._prevArrowClickHandler.bind(this));
            this._nextArrowElement.bind('click', this._nextArrowClickHandler.bind(this));

            this._clip.addEventListener('complete',function(client,text) {
              alert('copied!');
            });

            return this;
        },

        /**
         * Handle the next arrow button click event.
         * @method _nextArrowClickHandler <private> [Function]
         * @return unfined
         */
        _nextArrowClickHandler : function _nextArrowClickHandler() {
            if (this._nextVoiceElementData) {
                return this.updateWith(this._nextVoiceElementData);
            }
        },

        /**
         * Handle the prev arrow button click event.
         * @method _prevArrowClickHandler <private> [Function]
         * @return unfined
         */
        _prevArrowClickHandler : function _prevArrowClickHandler() {
            if (this._prevVoiceElementData) {
                return this.updateWith(this._prevVoiceElementData);
            }
        },

        /**
         * Rebuild the overlay itself with the passed voice data.
         * @method updateWith <public> [Function]
         * @argument voiceElement <required> [VoiceElement]
         * @return this [LinkOverlay]
         */
        updateWith : function updateWith(voiceElement) {
            this._prevVoiceElementData = voiceElement.getPreviousSiblingBySourceType(['link']);
            this._nextVoiceElementData = voiceElement.getNextSiblingBySourceType(['link']);

            this._updateDynamicSources(voiceElement);
            this._updateArrowState();

            this.element.slideDown(this.animationSpeed, function() {
                this.activate();

                if (!this._clipGlued) {
                    /* the button should glued just once, also the element
                     * should be visible, that's why we wait until the
                     * animation has finished.
                     * */
                    this._clip.glue('d_clip_button');
                    this._clipGlued = true;
                }

                this._clip.setText(voiceElement.postURL);
            }.bind(this));

            return this;
        },

        /**
         * Updates some dynamic information from the ui, such as the social
         * buttons, the iframe url and the flag button.
         * @method _upadteDynamicSouces <private> [Function]
         * @argument voiceElement <required> [VoiceElement]
         * @return this [LinkOverlay]
         */
        _updateDynamicSources : function _updateDynamicSources(voiceElement) {
            this._facebookButtonElement[0].href = this.FACEBOOK_URL_BASE + "u=" + voiceElement.URL;
            this._twitterButtonElement[0].href = this.TWITTER_URL_BASE + "text=" + encodeURIComponent(voiceElement.title) + "&url=" + voiceElement.URL + "&via=" + this.customName;
            this._flagButtonElement[0].href = "/" + window.currentVoice.slug + "/posts/" + voiceElement.id + "/votes.json?rating=" + ($(voiceElement.sourceElement).data('voted') ? 1 : -1);
            this._sourceButtonElement[0].href = voiceElement.postURL;
            this._iframeElement[0].src = "/home/redirect_to?url=" + voiceElement.postURL;

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
         * @return this [LinkOverlay]
         */
        _updateArrowState : function _updateArrowState() {
            if (this._prevVoiceElementData) {
                this._prevArrowElement[0].title = this._prevVoiceElementData.title;
                this._prevArrowElement.removeClass('disabled');
            } else {
                this._prevArrowElement.addClass('disabled');
            }

            if (this._nextVoiceElementData) {
                this._nextArrowElement[0].title = this._nextVoiceElementData.title;
                this._nextArrowElement.removeClass('disabled');
            } else {
                this._nextArrowElement.addClass('disabled');
            }

            return this;
        },

        _keyUpHandler : function _keyUpHandler(ev) {
            if (ev.keyCode == 27) { /* ESC */
                return this.deactivate();
            }

            if (ev.keyCode == 37) { /* prev */
                this._removeOnboardingTooltip();
                return this._prevArrowClickHandler();
            }

            if (ev.keyCode == 39) { /* next */
                this._removeOnboardingTooltip();
                return this._nextArrowClickHandler();
            }
        },

        _checkOnboarding : function _checkOnboarding () {
            if (CV.Utils.readCookie(this._onboardingCookie) === null) {
                this._onboardingTooltip = new CV.Tooltip({
                    html : '\
                        <p>You can use your keyboard keys to navigate through the content</p>\
                        <div class="arrows">\
                          <button class="cv-button cv-button--light">\
                            <i class="icon icon-arrow-left-small"></i>\
                          </button>\
                          <button class="cv-button cv-button--light">\
                            <i class="icon icon-arrow-right-small"></i>\
                          </button>\
                        </div>\
                        <p><a href="#" class="cv-dynamic-text-color cv-underline">Ok, got, it!</a></p>\
                    ',
                    className : 'keyboard-onboarding-navigation active'
                }).render(this.element.find('.onboarding-wrapper'));

                this._onboardingTooltip.element.find('a').bind('click', function (ev) {
                    ev.preventDefault();
                    this._removeOnboardingTooltip();
                }.bind(this));
            }

            return this;
        },

        _removeOnboardingTooltip : function _removeOnboardingTooltip() {
            if (!this._onboardingTooltip) {
                return this;
            }

            this._onboardingTooltip.deactivate();
            this._onboardingTooltip.getElement().remove();
            CV.Utils.createCookie(this._onboardingCookie, false, 365);

            return this;
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
                this._iframeElement[0].src = "";
            }.bind(this));

            return this;
        },

        destroy : function destroy() {
            Widget.prototype.destroy.call(this);

            this.customName = null;
            this.animationSpeed = null;
            this._nextArrowElement = null;
            this._prevArrowElement = null;
            this._closeButtonElement = null;
            this._sourceButtonElement = null;
            this._iframeElement = null;
            this._facebookButtonElement = null;
            this._twitterButtonElement = null;
            this._flagButtonElement = null;
        }
    }
});
