Class(CV, 'BackstoryTimelineYear').inherits(Widget)({
    ELEMENT_CLASS : 'cv-timeline-year',
    prototype : {
        months : null,
        init : function init(config) {
            Widget.prototype.init.call(this, config);

            this._setupElements();
        },

        _setupElements : function _setupElements() {
            /* add months with no_events (normal items) */
            this.months.forEach(function(month) {
                var has_no_events = month.events.some(function(event) {
                    return (event.is_event === false);
                });

                if (has_no_events) {
                    this.appendChild(new CV.BackstoryTimelineMonth({
                        name : 'month-' + month.numeric,
                        year : this.year,
                        month : month.numeric,
                        days : month.events
                    })).render(this.element);
                }
            }, this);

            this._addEventsCards();
        },

        _addEventsCards : function _addEventsCards() {
            var _events = [];
            var _cards = [];

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

            this.months.forEach(function(m) {
                return m.events.forEach(function(e) {
                    if (e.is_event) _events.push(e);
                });
            });

            /* add the events to the closest year+month last children */
            if (_events.length) {
                _events.forEach(function(e) {
                    var _event_month, _event_day, _fit;

                    _event_month = e.month;
                    _event_day = e.day;

                    _fit = this.children.some(function(m) {
                        if (m.month >= _event_month) {
                            return m.children.slice(0).reverse().some(function(d) {
                                if (~~d.data.day <= _event_day) {
                                    addCard.call(this, e, d);

                                    return true;
                                }
                            }, this);
                        }
                    }, this);

                    if (!_fit) {
                        this.children.slice(0).reverse().some(function(m) {
                            if (m.month < _event_month) {
                                addCard.call(this, e, m.children[m.children.length-1]);

                                return true;
                            }
                        }, this);
                    }
                }, this);
            }

            /* init card carrousels */
            _cards.forEach(function(card) {
                card.start();
            });

            return this;
        }
    }
});

