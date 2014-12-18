Class(CV, 'BackstoryTimelineCard').inherits(Widget)({
    HTML : '\
        <div class="cv-timeline-cards">\
            <div class="cv-timeline-card">\
                <div class="cv-timeline-card__image-wrapper">\
                    <img class="cv-timeline-card__image"/> \
                </div>\
                <div class="cv-timeline-card__info">\
                    <p class="cv-timeline-card__info-date">{{date}}</p>\
                    <p class="cv-timeline-card__info-desc">{{description}}</p>\
                </div>\
            </div>\
        </div>\
    ',
    prototype : {
        data : null,
        init : function init(config) {
            Widget.prototype.init.call(this, config);

            this.imageElement = this.element.find('.cv-timeline-card__image');
            this.dateElement = this.element.find('.cv-timeline-card__info-date');
            this.descriptionElement = this.element.find('.cv-timeline-card__info-desc');

            var year, month, day, date;

            year = this.data.event_date.substring(0,4);
            month = this.data.event_date.substring(5,7);
            day = this.data.event_date.substring(8,10);
            date = CV.Utils.getMonthShortName(month) + " " + day + ", " + year;

            this.imageElement.attr('src', this.data.background_image);
            this.dateElement.text(date);
            this.descriptionElement.text(this.data.description);
        }
    }
});
