Class('MediaOverlayCarousel').inherits(Widget)({
    HTML : '<ul class="scroll-secondary"></ul>',
    prototype : {
        init : function init(config) {
            Widget.prototype.init.call(this, config);
        },

        /**
         * Append the thumbnails to the carousel using VoiceElement widgets
         * references.
         * @property addThumbnails <public> [Function]
         * @argument voiceElements <required> [Array]
         * @return this [MediaOverlayCarousel]
         */
        addThumbnails : function addThumbnails(voiceElements) {
            voiceElements.forEach(function(voice) {
                this.appendChild(new MediaOverlayThumbnail({
                    imageSource : voice.thumbURL,
                    voiceElementData : voice
                })).render(this.element);
            }, this);

            return this;
        },

        /**
         * Returns the children which voiceElementData poperty matches the
         * passed object.
         * @property getCurrent <public> [Function]
         * @return undefined | children [Object]
         */
        getCurrent : function getCurrent(voiceElement) {
            var current;

            this.children.some(function(thumb) {
                if (thumb.voiceElementData === voiceElement) {
                    current = thumb;
                    return true;
                }
            });

            return current;
        },

        /**
         * Scroll to the passed child reference.
         * @prototype scrollToChild <public> [Function]
         * @return this [MediaOverlayCarousel]
         */
        scrollToChild : function scrollToChild(child) {
            this.element.animate({
                scrollLeft : child.getEl().offsetLeft
            }, 400);

            return this;
        },

        /**
         * Deactivate all its children.
         * @prototype deactivateAll <public> [Function]
         * @return this [MediaOverlayCarousel]
         */
        deactivateAll : function deactivateAll() {
            this.children.forEach(function(child) {
                child.deactivate();
            });

            return this;
        }
    }
});
