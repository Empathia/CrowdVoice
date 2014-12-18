Class(CV, 'SimpleTooltip').inherits(Widget)({
    ELEMENT_CLASS : 'cv-simple-tooltip',
    prototype : {
        _el : null,

        init : function(config) {
            Widget.prototype.init.call(this, config);

            this._el = this.element[0];

            this._bindEvents();
        },

        _bindEvents : function _bindEvents() {
            if (this.delegateHandler) {
                this.delegateHandler.element.delegate(this.delegateHandler.selector, 'mouseenter', this.mouseEnterHandler.bind(this));
                this.delegateHandler.element.delegate(this.delegateHandler.selector, 'mouseleave', this.deactivate.bind(this));
            }

            return this;
        },

        mouseEnterHandler : function mouseEnterHandler(ev) {
            var _clientRect = ev.currentTarget.getBoundingClientRect();

            this.element.text(ev.currentTarget.dataset.cvSimpleTooltipText);
            this._el.style.top = _clientRect.top - _clientRect.height - 10 + "px";
            this._el.style.left = _clientRect.left - this.element.width() / 2 + "px";

            this.activate();
        }
    }
});