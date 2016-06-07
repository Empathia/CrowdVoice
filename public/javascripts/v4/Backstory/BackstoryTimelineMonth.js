Class(CV, 'BackstoryTimelineMonth').inherits(Widget)({
    HTML : '\
        <div class="cv-timeline-month">\
            <div class="cv-timeline-month__label">\
              <div class="cv-timeline-month__label--upper">{month}</div>\
              <div class="cv-timeline-month__label--small">{year}</div>\
            </div>\
        </div>\
    ',
    prototype : {
        days : null,
        init : function init(config) {
            Widget.prototype.init.call(this, config);

            this.labelElement = this.element.find('.cv-timeline-month__label');
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
                }
            }, this);

            this.children[0].element.find('.cv-timeline-element__info-wrapper').append(this.labelElement);
        },

        /**
         * Proxy that checks if a mini event can be inserted on this month.
         * @public
         * @param {Object} miniEvent - The mini event data
         * @return {BackstoryTimelineElement || null}
         */
        canEventBeInserted: function(miniEvent) {
          var _insertAt = null;

          this.children.slice().reverse().some(function(event) {
            if ((miniEvent.month === this.month) && (miniEvent.day >= event.data.day)) {
              _insertAt = event;
              return true;
            }

            if (miniEvent.month > this.month) {
              _insertAt = event;
              return true;
            }
          }, this);

          return _insertAt;
        },

        hasEvents: function() {
          return this.children.length;
        },

        getLastEvent: function() {
          return this.children[this.children.length - 1];
        }
    }
});

