Class(CV, 'BackstoryBreadcrumb').inherits(Widget)({
    HTML : '\
        <div class="cv-timeline-breadcrum clearfix">\
            <div class="cv-timeline-breadcrum__title">Jump to</div>\
            <ul class="cv-timeline-breadcrum__points"></ul>\
        </div>\
    ',
    prototype : {
        data : null,
        init : function init(config) {
            Widget.prototype.init.call(this, config);
            console.log('breadcrum')

            this.pointsElement = this.element.find('.cv-timeline-breadcrum__points');
        },

        updateUI : function updateUI() {
            var year, months;

            this.data = CV.BackstoryRegistry.getInstance().get();

            if (this.type === 'month') {
                this._perMonth();
            } else if (this.type === 'year') {
                this._perYear();
            } else {
                this._perDecade();
            }
        },

        /**
         * Creates breadcrum items per month. ex: "JAN 2014", "FEB 2014"
         * @method _perMonth <private> [Function]
         * return undefined
         */
        _perMonth : function _perMonth() {
            var year, month, text;

            Object.keys(this.data).forEach(function(propertyName) {
                year = propertyName;
                months = this.data[propertyName];

                Object.keys(months).forEach(function(propertyName) {
                    text = CV.Utils.getMonthName(propertyName) + " " + year;

                    this.appendChild(new CV.BackstoryBreadcrumbItem({
                        name : year + '-' + propertyName,
                        text : text
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
            Object.keys(this.data).forEach(function(propertyName) {
                this.appendChild(new CV.BackstoryBreadcrumbItem({
                    name : propertyName,
                    text : propertyName
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

            Object.keys(this.data).forEach(function(year) {
                if (!buffer) {
                    buffer = (~~(year) + 10);

                    if (buffer < currentYear) {
                        console.log(year + '-' + buffer);
                        this.appendChild(new CV.BackstoryBreadcrumbItem({
                            name : year,
                            text : year + '-' + buffer
                        })).render(this.pointsElement);
                    } else {
                        console.log(year + '-' + currentYear);
                        this.appendChild(new CV.BackstoryBreadcrumbItem({
                            name : year,
                            text : year + '-' + currentYear
                        })).render(this.pointsElement);
                    }
                } else {

                    if (year > buffer) {
                        year = (buffer + 1);

                        var future = (~~(year) + 10);

                        if (future < currentYear) {
                            buffer = future;
                            console.log(year + '-' + future);
                            this.appendChild(new CV.BackstoryBreadcrumbItem({
                                name : year,
                                text : year + '-' + future
                            })).render(this.pointsElement);
                        } else if (last === false) {
                            last = true;
                            this.appendChild(new CV.BackstoryBreadcrumbItem({
                                name : year,
                                text : year + '-' + currentYear
                            })).render(this.pointsElement);
                            console.log(year + '-' + currentYear);
                        }
                    }
                }
            }, this);
        }
    }
});

