Class(CV, 'BackstoryUIComponent').inherits(Widget)({
    prototype : {
        elements : [],
        timelineElements : [],
        init : function init(config) {
            Widget.prototype.init.call(this, config);

            this.appendChild(new CV.BackstoryBreadcrumb({
                name : 'breadcrumb',
                range : this.breadcrumbRange || "Monthly"
            })).render(this.element);

            this.appendChild(new CV.BackstoryTimeline({
                name : 'timeline',
                background : this.background,
                voiceTitle : this.voiceTitle
            })).render(this.element);

            this.appendChild(new CV.BackstoryGalleryOverlay({
                name : 'galleryOverlay',
            })).render($(document.body));
        },

        showSpinner : function showSpinner() {
            return this;
        },

        hideSpinner : function hideSpinner() {
            return this;
        },

        updateUI : function updateUI() {
            this.timeline.updateUI();
            this.breadcrumb.updateUI();
            return this;
        },

        current : null,
        showOverlay : function showOverlay(data) {
            this.current = this.elements.indexOf(data);

            this.galleryOverlay.update(data);
            this.galleryOverlay.activate();

            return this;
        },

        loadNextGallery : function loadNextGallery() {
            if (this.current === this.elements.length - 1) return;

            return this.showOverlay(this.elements[this.current += 1]);
        },

        loadPreviousGallery : function loadPreviousGallery() {
            if (this.current === 0) return;

            return this.showOverlay(this.elements[this.current -= 1]);
        },

        /**
         * Proxy for BackstoryGalleryOverlay.updateImage method.
         * @method updateOverlayImage <public> [Function]
         * @params image <required> [Object]
         *      @example { image : "image.png", caption: "Caption", is_explicit: false }
         */
        updateOverlayImage : function updateOverlayImage(image) {
            this.galleryOverlay.updateImage(image);
            return this;
        }
    }
});
