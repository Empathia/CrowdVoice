Class(CV, 'BackstoryGalleryCarrousel').inherits(Widget)({
    HTML : '\
        <div>\
            <div class="cv-backstory-overlay__thumbs">\
                <ul></ul>\
            </div>\
            <div class="cv-backstory-overlay__arrows">\
                <a href="#" class="cv-button left-arrow">\
                    <i class="icon icon-arrow-left"></i>\
                </a>\
                <a href="#" class="cv-button right-arrow">\
                    <i class="icon icon-arrow-right"></i>\
                </a>\
            </div>\
        </div>\
    ',
    prototype : {
        _activeIndex: null,
        init : function init(config) {
            Widget.prototype.init.call(this, config);

            this._thumbsWrapperElement = this.element.find('.cv-backstory-overlay__thumbs > ul');
            this._leftArrowElement = this.element.find('.cv-backstory-overlay__arrows > .left-arrow');
            this._rightArrowElement = this.element.find('.cv-backstory-overlay__arrows > .right-arrow');

            this._bindEvents();
        },

        _bindEvents : function _bindEvents() {
            this._leftArrowElement.bind('click', function() {
                var newIndex = (this._activeIndex - 1);

                if (newIndex < 0) return;

                this.deactivateAll();
                this.activateByIndex(newIndex);
            }.bind(this));

            this._rightArrowElement.bind('click', function() {
                var newIndex = (this._activeIndex + 1);

                if (newIndex === this.children.length) return;

                this.deactivateAll();
                this.activateByIndex(newIndex);
            }.bind(this));

            return this;
        },

        /*
         */
        addThumbs : function addThumbs(data) {
            var videoID, imageURL;

            data.forEach(function(item) {
                if (item.video) {
                    videoID = item.video.match(/watch\?v=(.*)/)[1];
                    imageURL = 'http://img.youtube.com/vi/' + videoID + '/1.jpg';
                    item.videoID = videoID;
                } else {
                    imageURL = item.image;
                }

                this.appendChild(new CV.BackstoryGalleryThumb({
                    data : item,
                    thumbImageURL : imageURL
                })).render(this._thumbsWrapperElement);
            }, this);

            return this;
        },

        /*
         */
        activateByIndex : function activateByIndex(index) {
            this._activeIndex = index || 0;
            this.children[this._activeIndex].activate();

            return this;
        },

        /*
         * Deactivate all its children.
         * @method deactivateAll <public> [Function]
         * @return this [BackstoryGalleryCarrousel]
         */
        deactivateAll : function deactivateAll() {
            this.children.forEach(function(child) {
                child.deactivate();
            });

            return this;
        }
    }
});
