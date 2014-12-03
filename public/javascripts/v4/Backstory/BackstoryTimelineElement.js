Class(CV, 'BackstoryTimelineElement').inherits(Widget)({
    HTML : '\
        <div class="cv-timeline-element">\
          <div class="cv-timeline-element__gallery-wrapper cv-dynamic-border-color">\
            <div class="cv-timeline-element__gallery">\
              <div class="cv-timeline-element__gallery-frame">\
                <img/>\
              </div>\
            </div>\
          </div>\
          <div class="cv-timeline-element__time-ticks cv-dynamic-border-color"></div>\
          <div class="cv-timeline-element__info cv-dynamic-border-color">\
            <h3 class="cv-timeline-element__title">{{date}}</h3>\
            <p class="cv-timeline-element__description">{{title}}</p>\
            <button class="cv-timeline-view-button cv-button cv-button--small cv-button--light cv-dynamic-text-color">View</button>\
          </div>\
        </div>\
    ',
    FRAME_STRING_TEMPLATE : '<div class="cv-timeline-element__gallery-frame"></div>',

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
            this._frameElement = this._galleryWrapperElement.find('.cv-timeline-element__gallery-frame');
            this._coverImageElement = this._frameElement.find('img');
            this._dateElement = this.element.find('.cv-timeline-element__title');
            this._titleElement = this.element.find('.cv-timeline-element__description')
            this._viewButtonElement  = this.element.find('.cv-timeline-view-button');

            this._setupElements();
            this._bindEvents();
        },

        /**
         * Upates all the elements with the real information.
         * @method _setupElements <private> [Function]
         * @return this [BackstoryTimelineElement]
         */
        _setupElements : function _setupElements() {
            var day, month, year, date, totalImages, totalVideos;

            window.CV.backstoryUIComponent.elements.push(this.data);
            window.CV.backstoryUIComponent.timelineElements.push(this);

            year = this.data.event_date.substring(0,4);
            month = this.data.event_date.substring(5,7);
            day = this.data.event_date.substring(8,10);
            date = CV.Utils.getMonthShortName(month) + " " + day + ", " + year;
            totalImages = this.data.images.length;
            totalVideos = this.data.videos.length;

            this.data.year = year;
            this.data.month = month;
            this.data.day = day;

            this._coverImageElement.attr('src', this.data.background_image);
            this._dateElement.text(date);
            this._titleElement.text(this.data.name);

            if (totalImages > 0) {
                this._titleElement.append('<i class="icon icon-image"></i>');

                if (totalImages >= 2) {
                    this._frameElement.after(this.constructor.FRAME_STRING_TEMPLATE);
                }
            }

            if (totalVideos > 0) {
                this._titleElement.append('<i class="icon icon-video"></i>');

                if (totalVideos >= 2) {
                    this._frameElement.after(this.constructor.FRAME_STRING_TEMPLATE);
                }
            }

            if ((totalImages > 2) && (totalVideos > 2)) {
                this._frameElement.after(this.constructor.FRAME_STRING_TEMPLATE);
            }

            day = month = year = date = totalVideos = totalImages = null;

            return this;
        },

        _bindEvents : function _bindEvents() {
            this._galleryWrapperElement.bind('click', this._showOverlayHandler.bind(this));
            this._viewButtonElement.bind('click', this._showOverlayHandler.bind(this));

            return this;
        },

        _showOverlayHandler : function _showOverlayHandler() {
            window.CV.backstoryUIComponent.showOverlay(this.data);

            return this;
        }
    }
});

