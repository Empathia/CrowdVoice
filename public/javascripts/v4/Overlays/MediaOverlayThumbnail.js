Class('MediaOverlayThumbnail').inherits(Widget)({
    HTML : '\
        <li class="cv-dynamic-border-color">\
            <img/>\
        </li>\
    ',
    prototype : {
        /**
         * The source of the thumbnial image.
         * @property imageSource <optional> [String]
         */
        imageSource : null,

        /**
         * VoiceElement widget data.
         * @property voiceElementData <required> [Object]
         */
        voiceElementData : null,

        /**
         * Holds the reference to the image element.
         * @property _imageElement <private> [jQuery Object]
         */
        _imageElement : null,

        init : function(config) {
            Widget.prototype.init.call(this, config);

            this._imageElement = this.element.find('img');

            this._setup()._bindEvents();
        },

        /**
         * Setup element's data (classes, sorces, values, etc).
         * @property _setup <private> [Function]
         * @return this MediaOverlayThumbnail
         */
        _setup : function _setup() {
            this._imageElement[0].src = this.imageSource || this.voiceElementData.thumbURL;

            return this;
        },

        _bindEvents : function _bindEvents() {
            this.element.bind('click', function() {
                window.CV.OverlaysController.mediaOverlay.updateWith(this.voiceElementData);
            }.bind(this));

            return this;
        },

        /**
         * Returns the main widget's HTMLElement.
         * @property getEl <public> [Function]
         * return this.element[0] [HTMLElement]
         */
        getEl : function getEl() {
            return this.element[0];
        },

        destroy : function destroy() {
            Widget.prototype.destroy.call(this);

            this.imageSource = null;
            this.voiceElementData = null;
            this._imageElement = null;
        }
    }
});
