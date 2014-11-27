Class(CV, 'BackstoryTimelineMonth').inherits(Widget)({
    HTML : '\
        <div class="cv-timeline-month">\
            <div class="cv-timeline-month__label">\
              <div class="cv-timeline-month__label--upper">MAY</div>\
              <div class="cv-timeline-month__label--small">2014</div>\
            </div>\
        </div>\
    ',
    prototype : {
        days : null,
        init : function init(config) {
            Widget.prototype.init.call(this, config);

            this.monthElement = this.element.find('.cv-timeline-month__label--upper');
            this.yearElement = this.element.find('.cv-timeline-month__label--small');

            this.monthElement.text(CV.Utils.getMonthShortName(this.month));
            this.yearElement.text(this.year);

            this.days.forEach(function(day) {
                if (day.is_event === false) {
                    this.appendChild(new CV.BackstoryTimelineElement({
                        name : day.id,
                        data : day
                    })).render(this.element);
                } else {
                    // TODO: add events
                    /*
                    this.appendChild(new CV.BackstoryTimelineCard({
                        name : day.id,
                        data : day
                    })).render(this.element);
                    */
                }
            }, this);
        }
    }
});

