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
            console.log('show spinner')
            return this;
        },

        hideSpinner : function hideSpinner() {
            console.log('hide spinner')
            return this;
        },

        updateUI : function updateUI() {
            console.log('update ui')
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

            if (this.timelineElements[this.current + 1]._hasMedia === false) {
                this.current += 1;
                return this.loadNextGallery();
            }

            return this.showOverlay(this.elements[this.current += 1]);
        },

        loadPreviousGallery : function loadPreviousGallery() {
            if (this.current === 0) return;

            if (this.timelineElements[this.current - 1]._hasMedia === false) {
                this.current -= 1;
                return this.loadPreviousGallery();
            }

            return this.showOverlay(this.elements[this.current -= 1]);
        },

        updateOverlayImage : function updateOverlayImage(image) {
            this.galleryOverlay.updateImage(image);
            return this;
        }
    }
});
