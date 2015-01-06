Class(CV, 'BackstoryGalleryThumb').inherits(Widget)({
    HTML : '\
        <li class="cv-dynamic-active-border-color">\
            <img />\
        </li>\
    ',
    HTML_EXPLICIT_MESSAGE : '\
        <div class="is_explicit">\
            <i class="icon-warning"></i>\
        </div>\
    ',
    HTML_VIDEO_ICON : '<i class="icon icon-play"></i>',

    prototype : {
        data : null,

        init : function init(config) {
            Widget.prototype.init.call(this, config);

            this._imageElement = this.element.find('img');

            this._setupElements()._bindEvents();
        },

        _setupElements : function _setupElements() {
            if (this.data.video) {
                this.element.append(this.constructor.HTML_VIDEO_ICON);
            }

            if (this.data.is_explicit) {
                this.element.append(this.constructor.HTML_EXPLICIT_MESSAGE);
            }

            this._imageElement.attr('src', this.thumbImageURL);

            return this;
        },

        _bindEvents: function _bindEvents() {
            this.element.bind('click', function() {
                if (this.active) return;

                this.parent.deactivateAll()._activeIndex = this.element.index();
                this.activate();
            }.bind(this));

            return this;
        },

        _activate : function _activate() {
            Widget.prototype._activate.call(this);

            window.CV.backstoryUIComponent.updateOverlayImage(this.data);
        }
    }
});

