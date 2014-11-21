Class(CV, 'BackstoryTimelineCard').inherits(Widget)({
    HTML : '\
        <div class="cv-timeline-cards">\
            <div class="cv-timeline-card">\
                <img class="cv-timeline-card__image"/> \
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

            this.imageElement.attr('src', this.data.background_image);
            this.dateElement.text(this.data.event_date);
            this.descriptionElement.text(this.data.name);
        }
    }
});
