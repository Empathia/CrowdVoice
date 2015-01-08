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

            backstoryTimelineYear._addMiniEvents();
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

            /* add the events to the closest year+month last children */
            var data = getMonthChildren.call(backstoryTimelineYear);

            if (miniEvents.length) {
                miniEvents.forEach(function(mini_event) {
                    var mini_event_month, mini_event_day, found;

                    mini_event_month = ~~mini_event.month;
                    mini_event_day = ~~mini_event.day;

                    /* try to add mini_event to the nearest month/day (equal or ahead) */
                    found = data.some(function(dates) {
                        if (mini_event_month === ~~dates.month) {
                            return dates.children.some(function(monthChild) {
                                if (mini_event_day >= ~~monthChild.data.day) {
                                    addCard.call(backstoryTimelineYear, mini_event, monthChild);
                                    return true;
                                }
                            });
                        }
                    });

                    if (found) {
                        return true;
                    }

                    /* try to add mini_event to the nearest month/day (behind) */
                    data.slice(0).reverse().some(function(dates) {
                        if (mini_event_month > ~~dates.month) {
                            return dates.children.slice(0).reverse().some(function(monthChild) {
                                if (mini_event_day <= ~~monthChild.data.day) {
                                    addCard.call(backstoryTimelineYear, mini_event, monthChild);
                                    return true;
                                }
                            });
                        }
                    });
                });

                _cards.forEach(function(card) {
                    card.start();
                });
            }

            return this;
        }
    }
});

