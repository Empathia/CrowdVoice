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

        /**
         * Timeline element data holder
         * @property data <public> [Object]
         */
        data : null,

        _galleryWrapperElement : null,
        _coverImageElement : null,
        _dateElement : null,
        _titleElement : null,
        _viewButtonElement : null,

        init : function init(config) {
            Widget.prototype.init.call(this, config);

            this._galleryWrapperElement = this.element.find('.cv-timeline-element__gallery-wrapper');
            this._coverImageElement = this.element.find('.cv-timeline-element__gallery-frame').eq(0).find('img');
            this._dateElement = this.element.find('.cv-timeline-element__title');
            this._titleElement = this.element.find('.cv-timeline-element__description')
            this._viewButtonElement  = this.element.find('.cv-timeline-view-button');

            this._setupElements()._bindEvents();
        },

        /**
         * Upates the elements information to be displayed correctly.
         * @method _setupElements <private> [Function]
         */
        _setupElements : function _setupElements() {
            var day, month, year, date;

            window.CV.backstoryUIComponent.elements.push(this.data);

            year = this.data.event_date.substring(0,4);
            month = this.data.event_date.substring(5,7);
            day = this.data.event_date.substring(8,10);
            date = CV.Utils.getMonthShortName(month) + " " + day + ", " + year;

            this._coverImageElement.attr('src', this.data.background_image);
            this._dateElement.text(date);
            this._titleElement.text(this.data.name);

            day = month = year = date = null;

            return this;
        },

        _bindEvents : function _bindEvents() {
            this._galleryWrapperElement.bind('click', this._showOverlayHandler.bind(this));
            this._viewButtonElement.bind('click', this._showOverlayHandler.bind(this));

            return this;
        },

        _showOverlayHandler : function _showOverlayHandler() {
            window.CV.backstoryUIComponent.showOverlay(this.data);
        }
    }
});

