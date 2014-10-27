Class('MediaTool').inherits(Widget)({
    prototype : {
        /**
         * Tooltip Widget instance
         * @property _tooltip <private> [Widget]
         */
        _tooltip : null,
        /**
         * Holds the reference to the 'Cancel' anchor on the tooltips
         * @property _closeTooltip <private> [jQueryObject]
         */
        _closeTooltip : null,
        /**
         * Holds references to jQueryElements of the tooltip's default state.
         * @property _tooltipDefaultContent <private> [jQueryObject]
         */
        _tooltipDefaultContent : null,
        /**
         * Holds references to the jQueryElements of the tooltip's dirty state.
         * @property _tooltipDynamicContent <private> [jQueryObject]
         */
        _tooltipDynamicContent : null,
        /**
         * Holds the reference to the media icon's anchors.
         * @property _anchorElement <private> [jQueryObject]
         */
        _anchorElement : null,

        init : function init(config) {
            Widget.prototype.init.call(this, config);

            this._anchorElement = this.element.find('.media-type');
            this._tooltip = new CVTooltip({
                element : this.element.find('.cv-tooltip')
            });
            this._closeTooltip = this._tooltip.element.find('.tooltip-close-btn');
            this._tooltipDefaultContent = this._tooltip.element.find('.js-default');
            this._tooltipDynamicContent = this._tooltip.element.find('.js-with-content');

            this._bindEvents();
        },

        _bindEvents : function _bindEvents() {
            if (this._closeTooltip.length) {
                this._closeTooltip.bind('click', function(event) {
                    event.preventDefault();
                    this.deactivate();
                }.bind(this));
            }

            return this;
        },

        /**
         * Display the default state of the tooltip.
         * @method showTooltipDefaultContent <public> [Function]
         * @return this [MediaTool]
         */
        showTooltipDefaultContent : function showTooltipDefaultContent() {
            this.element.addClass('default');
            this._tooltipDefaultContent.show();
            this._tooltipDynamicContent.hide();

            return this;
        },

        /**
         * Display the dirty state of the tooltip.
         * @method showTooltipDynamicContent <public> [Function]
         * @return this [MediaTool]
         */
        showTooltipDynamicContent : function showTooltipDynamicContent() {
            this.element.removeClass('default');
            this._tooltipDefaultContent.hide();
            this._tooltipDynamicContent.show();

            return this;
        },

        /**
         * Returns the refence to the tooltip widget.
         * @method getTooltip <public> [Function]
         * @return this._tooltip [Tooltip]
         */
        getTooltip : function getTooltip() {
            return this._tooltip;
        },

        /**
         * Returns the reference to the main widget element.
         * @method getElement <public> [Function]
         * @return this.element [Object]
         */
        getElement : function getElement() {
            return this.element;
        },

        _activate : function _activate() {
            Widget.prototype._activate.call(this);

            this._anchorElement.addClass('active');
            this._tooltip.activate();
        },

        _deactivate : function _deactivate() {
            Widget.prototype._deactivate.call(this);

            this._anchorElement.removeClass('active');
            this._tooltip.deactivate();
        }
    }
});
