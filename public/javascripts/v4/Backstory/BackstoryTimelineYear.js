Class(CV, 'BackstoryTimelineYear').inherits(Widget)({
    ELEMENT_CLASS : 'cv-timeline-year',
    prototype : {
        months : null,
        mini_events: null,

        init : function init(config) {
            Widget.prototype.init.call(this, config);

            this.mini_events = [];
            this._setupElements();
        },

        _setupElements : function _setupElements() {
            var backstoryTimelineYear = this;

            /* add months with no_events, no need to create a month-wrapper
             * for an item with pure mini-events */
            backstoryTimelineYear.months.forEach(function(month) {
              var has_normal_events = false;

              month.events.map(function(event) {
                if (event.is_event === true) {
                  backstoryTimelineYear.mini_events.push(event);
                } else {
                  has_normal_events = true;
                }
              });

              if (has_normal_events) {
                backstoryTimelineYear.appendChild(new CV.BackstoryTimelineMonth({
                  name : 'month-' + month.numeric,
                  year : backstoryTimelineYear.year,
                  month : month.numeric,
                  days : month.events
                })).render(backstoryTimelineYear.element);
              }
            });
        },

        /**
         * Returns all the mini events of this year.
         * @public
         * @return {Array} - mini events collection
         */
        getMiniEvents: function() {
          return this.mini_events;
        },

        /**
         * Return the month instances of this year.
         * @public
         * @return {Array} - registered children
         */
        getMonths: function() {
          return this.children;
        },

        /**
         * Tries to insert a mini event in the nearest/previous year bucket.
         * @public
         * @param {Object} miniEvent - the mini event data
         * @usage
         *  year.tryToInsertEventPrev(e)
         * @return {BackstoryTimelineMonth}
         */
        tryToInsertEventPrev: function(miniEvent) {
          var prev = this.getPreviousSibling();

          if (prev) {
            var lastMonth = prev.getLastMonth();
            if (lastMonth && lastMonth.hasEvents()) {
             var lastMonthEvent = lastMonth.getLastEvent();
             return lastMonthEvent.addMiniEvent(miniEvent);
            }
            return this.tryToInsertEventPrev.call(prev, miniEvent);
          }
        },

        getFirstMonth: function() {
          return this.children[0];
        },

        getLastMonth: function() {
          return this.children[this.children.length - 1];
        }
    }
});
