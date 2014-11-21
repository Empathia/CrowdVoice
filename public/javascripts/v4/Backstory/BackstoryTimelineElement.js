Class(CV, 'BackstoryTimelineElement').inherits(Widget)({
    HTML : '\
        <div class="cv-timeline-element">\
          <div class="cv-timeline-element__gallery-wrapper cv-dynamic-border-color">\
            <div class="cv-timeline-element__gallery">\
              <div class="cv-timeline-element__gallery-frame">\
                <img/>\
              </div>\
              <div class="cv-timeline-element__gallery-frame"></div>\
              <div class="cv-timeline-element__gallery-frame"></div>\
              <div class="cv-timeline-element__gallery-frame"></div>\
            </div>\
          </div>\
          <div class="cv-timeline-element__time-ticks cv-dynamic-border-color"></div>\
          <div class="cv-timeline-element__info cv-dynamic-border-color">\
            <h3 class="cv-timeline-element__title">May 15, 2014</h3>\
            <p class="cv-timeline-element__description">{{title}}</p>\
            <button class="cv-timeline-view-button cv-button cv-button--small cv-button--light cv-dynamic-text-color">View</button>\
          </div>\
        </div>\
    ',
    prototype : {
        data : null,
        init : function init(config) {
            Widget.prototype.init.call(this, config);
            console.log('timeline element')

            this.coverImage = this.element.find('.cv-timeline-element__gallery-frame').eq(0).find('img');
            this.dateElement = this.element.find('.cv-timeline-element__title');
            this.titleElement = this.element.find('.cv-timeline-element__description')

            this._setupElements();
        },

        _setupElements : function _setupElements() {
            var day, month, year, date;

            year = this.data.event_date.substring(0,4);
            month = this.data.event_date.substring(5,7);
            day = this.data.event_date.substring(8,10);
            date = CV.Utils.getMonthShortName(month) + " " + day + ", " + year;

            this.coverImage.attr('src', this.data.background_image);
            this.dateElement.text(date);
            this.titleElement.text(this.data.name);
        }
    }
});

