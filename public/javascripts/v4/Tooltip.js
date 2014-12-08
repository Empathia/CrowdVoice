Class(CV, 'Tooltip').inherits(Widget)({
    ELEMENT_CLASS : 'cv-tooltip',
    HTML : '\
        <div>\
            <div class="cv-tooltip__arrow">\
                <span class="cv-tooltip__arrow-item"></span>\
            </div>\
            <div class="cv-tooltip-inner clearfix"></div>\
        </div>\
    ',
    /**
     * @constant HAS_TOOLTIP_CLASSNAME <private> [String]
     * This css-class applied to the tooltip's parent will make the tooltip to
     * be shown when the parent is hovered (pure css approach).
     */
    HAS_TOOLTIP_CLASSNAME : 'has-cv-tooltip',

    prototype : {
        /**
         * The text to be shown on the tooltip.
         * @property text <public> [String]
         */
        text : null,
        /**
         * The HTML content to be appended to the tooltip.
         * @property html <public> [String|jQueryElement|HTMLElement]
         */
        html : null,
        /**
         * The position in which the tooltip will be shown.
         * @property position <public> [String] {top|right|bottom|left} (bottom)
         */
        position : null,
        /**
         * Tells the tooltip to no break its contents. It applies a css-class
         * that contains the rule: `white-space: nowrap'`
         * @property nowrap <public> [Boolean]
         */
        nowrap : false,

        /**
         */
        showOnCssHover : true,

        /**
         */
        toggler: null,
         /**
          */
        enterTogglerElementEvent: null,
        /**
         */
        leaveTogglerElementEvent: null,

        /**
         * Holds the reference to the tooltip's arrow element.
         * @property _arrowElement <private> [jQueryElement]
         */
         _arrowElement : null,
        /**
         * Holds the reference to the tooltip's body jQueryElement.
         * @property _contentElement <private> [jQueryElement]
         */
        _contentElement : null,

        init : function(config) {
            Widget.prototype.init.call(this, config);

            this._contentElement = this.element.find('.cv-tooltip-inner');
            this._arrowElement = this.element.find('.cv-tooltip__arrow');

            this._setup()._bindEvents();
        },

        /**
         * Create the tooltip based on the passed properties.
         * @method _setup <private> [Function]
         * @return this [Tooltip]
         */
        _setup : function _setup() {
            this.element.addClass('cv-tooltip--' + (this.position || 'bottom'));

            if (this.text) {
                this.updateText(this.text);
            }

            if (this.html) {
                this.updateHTML(this.html);
            }

            if (this.nowrap === true) {
                this.element.addClass('cv-tooltip--nowrap');
            }

            return this;
        },

        _bindEvents : function _bindEvents() {
            if (this.toggler) {
                if (this.enterTogglerElementEvent) {
                    this.toggler.bind('mouseenter', function(ev) {
                        this.enterTogglerElementEvent(ev);
                    }.bind(this));
                }

                if (this.leaveTogglerElementEvent) {
                    this.toggler.bind('mouseleave', function(ev) {
                        this.leaveTogglerElementEvent(ev);
                    }.bind(this));
                }
            }

            return this;
        },

        /**
         * Return the tooltip element reference.
         * @method getElement <public> [Function]
         * @return this.element [jQuery Object]
         */
        getElement : function getElement() {
            return this.element;
        },

        /**
         * Set custom styles to the tooltip. Useful when we need to update its
         * position on the fly.
         * @method setTooltipStyles <public> [Function]
         * @argument styles <required> [Object]
         * @example tooltip.setTooltipStyles({width: 100, height: 200, left: 10})
         * @return this [CV.Tooltip]
         */
        setTooltipStyles : function setTooltipStyles (styles) {
            this.element.css(styles);

            return this;
        },

        /**
         * Set custom styles to the tooltip's arrow. Useful when we need to
         * update its position on the fly.
         * @method setArrowStyles <public> [Function]
         * @argument styles <required> [Object]
         * @example tooltip.setArrowStyles({width: 100})
         * @return this [CV.Tooltip]
         */
        setArrowStyles : function setArrowStyles (styles) {
            this._arrowElement.css(styles);

            return this;
        },

        /**
         * Change the tooltip's single text.
         * @method updateText <public> [Function]
         * @usage tooltipInstance.upadteText('Lorem Ipsum');
         * @return this [Tooltip]
         */
        updateText : function updateText(value) {
            this._contentElement.text(value);

            return this;
        },
        /**
         * Update the tooltip's HTML content.
         * @method updateHTML <public> [Function]
         * @usage tooltipInstance.updateHTML('<p>Lorem Ipsum</p>');
         * @return this [Tooltip]
         */
         updateHTML : function updateHTML(value) {
            this._contentElement.html(value);

            return this;
        },

        /**
         * Extended render method to add a css-class to the tooltip's parent
         * element. This class will make the tooltip to be shown when hover
         * over the parent with pure css.
         */
        render : function render(element, beforeElement) {
            Widget.prototype.render.call(this, element, beforeElement);

            if (this.showOnCssHover) {
                element.addClass(this.constructor.HAS_TOOLTIP_CLASSNAME);
            }

            return this;
        }
    }
});
