Class(CV, 'BackstoryBreadcrumbItem').inherits(Widget)({
    HTML : '\
        <li class="cv-timeline-breadcrum__point-item cv-dynamic-text-color"></li>\
    ',
    prototype : {
        init : function init(config) {
            Widget.prototype.init.call(this, config);
            console.log('breadcrum item')

            this.element.text(CV.Utils.getMonthName(this.month) + " " + this.year);
        }
    }
});

