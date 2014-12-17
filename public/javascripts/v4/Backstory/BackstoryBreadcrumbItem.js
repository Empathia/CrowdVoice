Class(CV, 'BackstoryBreadcrumbItem').inherits(Widget)({
    HTML : '\
        <li class="cv-timeline-breadcrum__point-item cv-dynamic-text-color"></li>\
    ',
    prototype : {
        year: null,
        month: null,
        day: null,

        init : function init(config) {
            Widget.prototype.init.call(this, config);

            this.element.text(this.text);

            this._bindEvents();
        },

        _bindEvents : function _bindEvents() {
            this.element.bind('click', function() {
                this.parent.deactivateAll();
                this.activate();
                this.parent.scrollTo(this.year, this.month, this.day);
            }.bind(this));

            return this;
        }
    }
});

