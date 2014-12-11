Class(CV, 'BackstoryTimelineYear').inherits(Widget)({
    ELEMENT_CLASS : 'cv-timeline-year',
    prototype : {
        months : null,
        init : function init(config) {
            Widget.prototype.init.call(this, config);

            this.months.forEach(function(month) {
                this.appendChild(new CV.BackstoryTimelineMonth({
                    name : 'month-' + month.numeric,
                    year : this.year,
                    month : month.numeric,
                    days : month.events
                })).render(this.element);
            }, this);
        }
    }
});

