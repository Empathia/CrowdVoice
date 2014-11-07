/**
 * Control both MediaOverlay and LinkOverlay overlay widgets.
 * It listens to the VoiceElement widget click event and based on the passed
 * data (VoiceElement data), it can activate the approapiate Overlay.
 * @class OverlaysController <public>
 */
Class('OverlaysController').includes(NodeSupport)({
    prototype : {
        init : function init() {
            this.appendChild(new MediaOverlay({
                name : 'mediaOverlay',
                element : $('.cv-overlay.cv-media-gallery')
            }))

            this.appendChild(new LinkOverlay({
                name : 'linkOverlay',
                element : $('.cv-overlay.cv-link-gallery')
            }));
        },

        /**
         * Method responsable for displaying the correct overlay depending on
         * the passed voice's sourceType (link, video|image).
         * @property showOverlay <public> [Function]
         * @argument voiceElement <required> [VoiceElement]
         */
        showOverlay : function showOverlay(voiceElement) {
            console.log(voiceElement.sourceType)

            if (voiceElement.sourceType === "link") {
                return this.linkOverlay.updateWith(voiceElement);
            }

            return this.mediaOverlay.createCarrousel(voiceElement).updateWith(voiceElement);
        }
    }
});
