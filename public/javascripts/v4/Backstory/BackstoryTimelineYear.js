Class(CV, 'BackstoryTimelineYear').inherits(Widget)({
    ELEMENT_CLASS : 'cv-timeline-year',
    prototype : {
        months : null,
        init : function init(config) {
            Widget.prototype.init.call(this, config);
            console.log('timeline year')

            Object.keys(this.months).forEach(function(propertyName) {
                this.appendChild(new CV.BackstoryTimelineMonth({
                    name : 'month-' + propertyName,
                    year : this.year,
                    month : propertyName,
                    days : this.months[propertyName]
                })).render(this.element);
            }, this)
        }
    }
});

