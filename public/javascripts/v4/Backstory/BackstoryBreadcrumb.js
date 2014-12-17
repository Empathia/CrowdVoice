Class(CV, 'BackstoryBreadcrumb').inherits(Widget)({
    HTML : '\
        <div class="cv-timeline-breadcrum clearfix">\
            <div class="cv-timeline-breadcrum__title">Jump to</div>\
            <ul class="cv-timeline-breadcrum__points scroll-primary"></ul>\
        </div>\
    ',
    prototype : {

        _data : null,

        init : function init(config) {
            Widget.prototype.init.call(this, config);

            this.pointsElement = this.element.find('.cv-timeline-breadcrum__points');
        },

        getData : function getData() {
            return this._data;
        },

        setData : function setData(data) {
            this._data = data;
        },

        updateUI : function updateUI() {
            this.setData(CV.BackstoryRegistry.getInstance().get());

            if (this.range === 'Monthly') {
                this._perMonth();
            } else if (this.range === 'Yearly') {
                this._perYear();
            } else {
                this._perDecade();
            }
        },

        scrollTo : function scrollTo(year, month, day) {
            var _element;

            if (this.range === "Monthly") {
                window.CV.backstoryUIComponent.timelineElements.some(function(el) {
                    if ((el.data.year === year) && (el.data.month === month)) {
                        _element = el;
                        return true;
                    }
                });
            } else if (this.range === "Yearly") {
                window.CV.backstoryUIComponent.timelineElements.some(function(el) {
                    if (el.data.year === year) {
                        _element = el;
                        return true;
                    }
                });
            } else if (this.range === "Decade") {
                window.CV.backstoryUIComponent.timelineElements.some(function(el) {
                    if (el.data.year >= year) {
                        _element = el;
                        return true;
                    }
                });
            }

            if (_element) {
                CV.backstoryUIComponent.timeline._timelineElement.animate({
                    scrollLeft : _element.element[0].offsetParent.offsetLeft
                }, 400);
            }

            return this;
        },

        /**
         * Activate the closest 'BackstoryBreadcrumbItem' children that matches
         * with the passed year, month params.
         * @method activateItemByDate <public> [Function]
         * @argument _year <reqired> [Number]
         * @argument _month <reqired> [Number]
         * @example this.activateItemByDate(1987, 07);
         * @return this [BackstoryBreadcrumb]
         */
        activateItemByDate : function activateItemByDate(_year, _month) {
            var backstoryBreadcrumb = this;

            if (this.range === "Monthly") {
                this.children.some(function(item) {
                    if ((_year == item.year) && (_month == item.month)) {
                        backstoryBreadcrumb.deactivateAll();
                        item.activate();
                        return true;
                    }
                });

                return this;
            }

            if (this.range === "Yearly") {
                this.children.some(function(item) {
                    if (_year == item.year) {
                        backstoryBreadcrumb.deactivateAll();
                        item.activate();
                        return true;
                    }
                });

                return this;
            }

            if (this.range === "Decade") {
                this.children.some(function(item) {
                    if ((~~item.year + 10) >= _year) {
                        backstoryBreadcrumb.deactivateAll();
                        item.activate();
                        return true;
                    }
                });

                return this;
            }
        },

        /**
         * Creates breadcrum items per month. ex: "JAN 2014", "FEB 2014"
         * @method _perMonth <private> [Function]
         * return undefined
         */
        _perMonth : function _perMonth() {
            var year, months, text;

            this.getData().forEach(function(item) {
                year = item.year;
                months = item.months;

                months.forEach(function(month) {
                    text = CV.Utils.getMonthName(month.numeric) + " " + year;

                    this.appendChild(new CV.BackstoryBreadcrumbItem({
                        name : year + '-' + month.numeric,
                        text : text,
                        year : year,
                        month : month.numeric,
                        day : null
                    })).render(this.pointsElement);
                }, this);
            }, this);
        },

        /**
         * Creates breadcrum items per year. Ex: "2012", "2013", "2014"
         * @method _perYear <private> [Function]
         * return undefined
         */
        _perYear : function _perYear() {
            this.getData().forEach(function(item) {
                this.appendChild(new CV.BackstoryBreadcrumbItem({
                    name : item.year,
                    text : item.year,
                    year : item.year,
                    month : null,
                    day : null
                })).render(this.pointsElement);
            }, this);
        },

        /**
         * TODO: refactor this stuff :/
         * Creates breadcrum items per decade. Ex: "1987-1997", "1998-2008"
         * @method _perDecade <private> [Function]
         * @return undefined
         */
        _perDecade : function _perDecade() {
            var buffer, last, currentYear;

            currentYear = new Date().getFullYear();
            last = false;

            this.getData().forEach(function(year) {
                if (!buffer) {
                    buffer = (~~(year.year) + 10);

                    if (buffer < currentYear) {
                        this.appendChild(new CV.BackstoryBreadcrumbItem({
                            name : year.year,
                            text : year.year + '-' + buffer,
                            year : year.year,
                            month : null,
                            day : null
                        })).render(this.pointsElement);
                    } else {
                        this.appendChild(new CV.BackstoryBreadcrumbItem({
                            name : year.year,
                            text : year.year + '-' + currentYear,
                            year : year.year,
                            month : null,
                            day : null
                        })).render(this.pointsElement);
                    }
                } else {

                    if (year.year > buffer) {
                        year = (buffer + 1);

                        var future = (~~(year) + 10);

                        if (future < currentYear) {
                            buffer = future;
                            this.appendChild(new CV.BackstoryBreadcrumbItem({
                                name : year,
                                text : year + '-' + future,
                                year : year,
                                month : null,
                                day : null
                            })).render(this.pointsElement);
                        } else if (last === false) {
                            last = true;
                            this.appendChild(new CV.BackstoryBreadcrumbItem({
                                name : year,
                                text : year + '-' + currentYear,
                                year : year,
                                month : null,
                                day : null
                            })).render(this.pointsElement);
                        }
                    }
                }
            }, this);
        },

        /**
         * Deactivate all its children.
         * @prototype deactivateAll <public> [Function]
         * @return this [MediaOverlayCarousel]
         */
        deactivateAll : function deactivateAll() {
            this.children.forEach(function(child) {
                child.deactivate();
            });

            return this;
        }
    }
});

