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

        overlay : null,
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

        _prevVoiceElementData : null,
        _nextVoiceElementData : null,

        init : function init(config) {
            Widget.prototype.init.call(this, config);

            this.overlay = $('.cv-overlay-backdrop.cv-link-gallery');
            this.customName = this.element.data('custom-name');
            this._nextArrowElement = this.element.find('.voice-arrow.next');
            this._prevArrowElement = this.element.find('.voice-arrow.prev');
            this._closeButtonElement = this.element.find('.js-back-to-voice-button');
            this._sourceButtonElement = this.element.find('.js-link-gallery-source-button');
            this._iframeElement = this.element.find('iframe');
            this._facebookButtonElement = this.element.find('.actions .facebook');
            this._twitterButtonElement = this.element.find('.actions .twitter');
            this._flagButtonElement = this.element.find('.flag-div .flag');

            this._bindEvents();
        },

        _bindEvents : function _bindEvents() {
            this._closeButtonElement.bind('click', this.deactivate.bind(this));
            this._prevArrowElement.bind('click', this._prevArrowClickHandler.bind(this));
            this._nextArrowElement.bind('click', this._nextArrowClickHandler.bind(this));
            this._iframeElement.load(function() {
                this.overlay.hide();
            }.bind(this));

            return this;
        },

        /**
         * Handle the next arrow button click event.
         * @method _nextArrowClickHandler <private> [Function]
         */
        _nextArrowClickHandler : function _nextArrowClickHandler(ev) {
            ev.preventDefault();

            if (this._nextVoiceElementData) {
                return this.updateWith(this._nextVoiceElementData);
            }
        },

        /**
         * Handle the prev arrow button click event.
         * @method _prevArrowClickHandler <private> [Function]
         */
        _prevArrowClickHandler : function _prevArrowClickHandler(ev) {
            ev.preventDefault();

            if (this._prevVoiceElementData) {
                return this.updateWith(this._prevVoiceElementData);
            }
        },

        /**
         * Rebuild the overlay itself with the passed voice data.
         * @method updateWith <public> [Function]
         * @argument voiceElement <required> [Object]
         * @return this [LinkOverlay]
         */
        updateWith : function updateWith(voiceElement) {
            this.overlay.show();

            this._prevVoiceElementData = voiceElement.getPreviousSiblingBySourceType(['link']);
            this._nextVoiceElementData = voiceElement.getNextSiblingBySourceType(['link']);

            this._updateDynamicSources(voiceElement);
            this._updateArrowState();

            this.element.slideDown(this.animationSpeed);

            return this;
        },

        /**
         * Updates some dynamic information from the ui, such as the social
         * buttons, the iframe url and the flag button.
         * @property _upadteDynamicSouces <private> [Function]
         * @return this [LinkOverlay]
         */
        _updateDynamicSources : function _updateDynamicSources(voiceElement) {
            this._facebookButtonElement[0].href = this.FACEBOOK_URL_BASE + "u=" + voiceElement.URL;
            this._twitterButtonElement[0].href = this.TWITTER_URL_BASE + "text=" + encodeURIComponent(voiceElement.title) + "&url=" + voiceElement.URL + "&via=" + this.customName;
            this._flagButtonElement[0].href = "/" + window.currentVoice.slug + "/posts/" + voiceElement.id + "/votes.json?rating=" + (voiceElement.sourceElement.data('voted') ? 1 : -1);
            this._iframeElement[0].src = voiceElement.postURL;

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

        _deactivate : function _deactivate() {
            Widget.prototype._deactivate.call(this);

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
