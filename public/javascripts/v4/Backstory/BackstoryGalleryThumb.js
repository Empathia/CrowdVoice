Class(CV, 'BackstoryGalleryThumb').inherits(Widget)({
    HTML : '\
        <li class="cv-dynamic-active-border-color">\
            <img />\
        </li>\
    ',
    prototype : {
        data : null,
        _imageTmp : null,

        init : function init(config) {
            Widget.prototype.init.call(this, config);

            this._imageElement = this.element.find('img');

            this._setupElements()._bindEvents();
        },

        _setupElements : function _setupElements() {
            this._imageTmp = new Image();
            this._imageTmp.src = this.data.image;

            this._imageElement.attr('src', this.data.image);

            return this;
        },

        _bindEvents: function _bindEvents() {
            /*
            $(this._imageTmp).bind('load', function(ev) {
            }.bind(this));
            */

            this.element.bind('click', function() {
                if (this.active) return;

                this.parent.deactivateAll();
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

