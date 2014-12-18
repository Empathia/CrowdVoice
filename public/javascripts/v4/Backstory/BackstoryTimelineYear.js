Class(CV, 'BackstoryTimelineYear').inherits(Widget)({
    ELEMENT_CLASS : 'cv-timeline-year',
    prototype : {
        months : null,
        init : function init(config) {
            Widget.prototype.init.call(this, config);

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

            /* filter events (floating cards) */
            var events = [];
            this.months.forEach(function(m) {
                return m.events.forEach(function(e) {
                    if (e.is_event) {
                        events.push(e);
                    }
                });
            });

            /* add the events to the closest year+month last children */
            if (events.length) {
                console.log('%c' + events.length,'color:red; font-size:20px; font-weight: bold;')
                events.forEach(function(e) {
                    var event_month, event_day, fit;

                    event_month = e.month;
                    event_day = e.day;

                    fit = this.children.some(function(m) {
                        if (m.month >= event_month) {
                            return m.children.slice(0).reverse().some(function(d) {
                                if (~~d.data.day <= event_day) {
                                    this.appendChild(new CV.BackstoryTimelineCard({
                                        name : e.id,
                                        data : e
                                    })).render(d.element);

                                    return true;
                                }
                            }, this);
                        }
                    }, this);

                    if (!fit) {
                        console.log('%c' + event_month + " " + event_day + " " + e.year, 'color:red; font-weight:bold')
                        this.children.slice(0).reverse().some(function(m) {
                            if (m.month < event_month) {
                                this.appendChild(new CV.BackstoryTimelineCard({
                                    name : e.id,
                                    data : e
                                })).render(m.children[m.children.length-1].element);
                                console.log('LR: ', m.month, event_month,  event_day)
                                return true;
                            }
                        }, this);
                    }
                }, this);
            }
        }
    }
});

