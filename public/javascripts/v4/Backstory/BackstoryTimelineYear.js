Class(CV, 'BackstoryTimelineYear').inherits(Widget)({
    ELEMENT_CLASS : 'cv-timeline-year',
    prototype : {
        months : null,
        init : function init(config) {
            Widget.prototype.init.call(this, config);

            this._setupElements();
        },

        _setupElements : function _setupElements() {
            var backstoryTimelineYear = this;

            /* add months with no_events, no need to create a month-wrapper
             * for an item with pure mini-events */
            backstoryTimelineYear.months.forEach(function(month) {
                var has_no_mini_events = month.events.some(function(event) {
                    return (event.is_event === false);
                });

                if (has_no_mini_events) {
                    backstoryTimelineYear.appendChild(new CV.BackstoryTimelineMonth({
                        name : 'month-' + month.numeric,
                        year : backstoryTimelineYear.year,
                        month : month.numeric,
                        days : month.events
                    })).render(backstoryTimelineYear.element);
                }
            });

            setTimeout(function() {
              backstoryTimelineYear._addMiniEvents();
            }, 0);
        },

        _addMiniEvents : function _addMiniEvents() {
            var backstoryTimelineYear, miniEvents, _cards;

            backstoryTimelineYear = this;
            miniEvents = [];
            _cards = [];

            function addCard(event, appendToWidget) {
                var _name = 'cards-' + appendToWidget.data.year + "-" + appendToWidget.data.month + "-" + appendToWidget.data.day;

                if (!this[_name]) {
                    _cards.push(
                        this.appendChild(new CV.BackstoryTimelineCards({
                            name : _name
                        })).render(appendToWidget.element.find('.cv-timeline-element__info-wrapper'))
                    );
                }

               this[_name].appendChild(new CV.BackstoryTimelineCard({
                    name: event.id,
                    data: event
                })).render(this[_name].carrouselElement);
            }

            function getMonthChildren() {
                return this.children.map(function(child) {
                    if (child.name.indexOf('month') >= 0) {
                        return child;
                    }
                });
            }

            backstoryTimelineYear.months.forEach(function(month) {
                month.events.forEach(function(e) {
                    if (e.is_event) {
                        miniEvents.push(e);
                    }
                });
            });

            if (!miniEvents.length) return this;

            var months = getMonthChildren.call(backstoryTimelineYear);

            miniEvents.forEach(function(mini_event) {
              var mini_event_month = ~~mini_event.month;
              var mini_event_day = ~~mini_event.day;

              var found_first = months.slice().reverse().some(function(month) {
                var current_month = ~~month.month;

                return month.children.slice().reverse().some(function(event, index) {
                  var current_day = ~~event.data.day;

                  if ((mini_event_month === current_month) && (mini_event_day >= current_day)) {
                    addCard.call(backstoryTimelineYear, mini_event, event);
                    return true;
                  }

                  if (mini_event_month > current_month) {
                    addCard.call(backstoryTimelineYear, mini_event, event);
                    return true;
                  }
                });
              });

              if (found_first) {
                return true;
              }

              months.slice().some(function(month) {
                var current_month = ~~month.month;

                return month.children.slice().some(function(event, index) {
                  var current_day = ~~event.data.day;

                  if (mini_event_month < current_month) {
                    var previous_event = event.parent.getPreviousSibling();

                    if (previous_event) {
                      var previous_last_event = previous_event.children[previous_event.children.length - 1];
                      if (previous_last_event) {
                        addCard.call(backstoryTimelineYear, mini_event, previous_last_event);
                        return true;
                      }
                    } else {
                      var previous_year = event.parent.parent.getPreviousSibling();
                      if (previous_year) {
                        var previous_year_last_month = previous_year.children[previous_year.children.length - 1];
                        if (previous_year_last_month) {
                          var previous_year_last_event = previous_year_last_month.children[previous_year_last_month.children.length - 1];
                          if (previous_year_last_event) {
                            addCard.call(previous_year, mini_event, previous_year_last_event);
                            return true;
                          }
                        }
                      }
                    }
                  }
                });
              });
            });

            _cards.map(function(card) {
              card.start();
            });

            return this;
        }
    }
});

