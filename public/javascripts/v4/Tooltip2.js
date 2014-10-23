Class('Tooltip2').inherits(Widget)({
    ELEMENT_CLASS : 'cv-tooltip',
    HTML : '\
        <div class="tooltip">\
          <div class="tooltip-positioner">\
            <span class="tooltip-arrow">\
                <span></span>\
            </span>\
            <div class="cv-tooltip-inner clearfix">\
            </div>\
          </div>\
        </div>\
    ',
    HAS_TOOLTIP_CLASSNAME : 'has-cv-tooltip',

    prototype : {
        text : null,
        nowrap : false,
        parentElement : null,
        contentElement : null,

        init : function(config) {
            Widget.prototype.init.call(this, config);

            this.contentElement = this.element.find('.cv-tooltip-inner');

            this._setup();
        },

        _setup : function _setup() {
            if (this.text) {
                this.updateText(this.text);
            }

            if (this.html) {
                this.updateHTML(this.html);
            }

            if (this.position) {
                this.element.addClass('cv-tooltip--' + this.position);
            }

            if (this.nowrap === true) {
                this.element.addClass('cv-tooltip--nowrap');
            }

            return this;
        },

        updateText : function updateText(value) {
            this.contentElement.text(value);

            return this;
        },

        updateHTML : function updateHTML(value) {
            this.contentElement.html(value);

            return this;
        },

        render : function(element, beforeElement) {
            Widget.prototype.render.call(this, element, beforeElement);

            element.addClass(this.constructor.HAS_TOOLTIP_CLASSNAME);

            return this;
        }
    }
});
