Class('Timeline').inherits(Widget)({
    prototype : {
        progress : false,
        init : function(config) {
            Widget.prototype.init.call(this, config);

            var progress = new Loader({
                name : 'progress'
            });

            this.appendChild(progress)

            progress.render($('body'));
            
            var voicesScrollerContainer = $('.voices-scroller').parent();
        },

        loadPage: function (page) {
            var timeline = this;

            page = page || CV.voicesContainer.currentPage;

            this.progress.activate();

            CV.voicesContainer.enableNextPage(function(){
                CV.timeline.afterFetchActions();
            });
        },

        loadDate: function (date, callback) {
            var timeline = this;

            timeline.progress.activate();
            
            var params = {};

            params.start = date;

            this.startDate = date;

            if ($.deparam.querystring().mod) {
                params.mod = true;
            }

            setTimeout(function() {
                CV.voicesContainer.goToDate(params.start);    
            }, 100);
            
        },

        months: [0, 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        monthsFullNames: [0, 'January ', 'February ', 'March ', 'April ', 'May ', 'June ', 'July ', 'August ', 'September ', 'October ', 'November ', 'December '],

        build: function (element, options) {
            this.options = {
                dates   : window.timeline_dates
            };
            $.extend(this.options, options);

            var that                = this;
            this.element            = element;
            this.slider             = this.element.find('#slider-vertical');
            this.dates              = this.options.dates;
            this.userWindow         = $(window);
            this._body              = $('body');
            this.mainHeader         = $('.main-header');
            this.bottomScroller     = $('.bottom-scroll');
            this.topScroller        = $('.top-scroll');
            this.scrollable         = $.browser.mozilla || $.browser.msie ? 'html' : 'body';
            this.voiceScroller      = $('.voices-scroller');
            this.voicesContainer    = $('.voices-container');
            this.announcementBar    = $('.flash-message');
            this.postFetcher        = $('.post-fetch-trigger');
            this.voiceTitle         = $('.voice-title');
            this.loadingScript      = false;
            this.needsScrollTop     = false;

            this._createYearSliders();
            this._setHeight();
            this._createSlider();

            $('> li:last', this.element).addClass('last');

            this.voicesContainer.removeClass('initial-state');
            this.bindEvents();
            this.updateSliderPosition();

        },
        bindEvents: function(){
            var that = this;

            if (!isDevice){

                this.voiceScroller.bind('mousewheel', function(e) {
                    var scroller = this;

                    clearTimeout( $.data( this, "scrollCheck" ) );
                    
                    $.data( this, "scrollCheck", setTimeout(function() {
                        that.debouncePositionUpdate();
                    }, 200) );

                    var maxScrollY = scroller.scrollHeight - scroller.offsetHeight,
                        isAtBottom = scroller.scrollTop >= (maxScrollY - 300),
                        isSmallScreen = window.innerWidth <= 1024;

                    if (isAtBottom && !isSmallScreen) {
                        that.fetchPosts();
                    }

                });
            }

            this.element.bind('posts:served', function(ev, data){
                that.afterFetchActions(data);
            });

            this.postFetcher.bind('click', function(){
                that.fetchPosts();
            });

            this.userWindow.bind('resize smartresize', function() {
                that._setHeight();
            });

            this.announcementBar.bind('flash.close', function () {
                that._setHeight();
            });

        },
        debouncePositionUpdate: function(){
            var that = this;
            clearTimeout(this.updateTimeout);
            this.updateTimeout = setTimeout(function(){
                that.updateSliderPosition();
            }, 50);
        },
        fetchPosts: function(needsScrollTop){
            var perPage     = CV.voicesContainer.perPage;
            var totalVoices = CV.voicesContainer.preloadedVoices.length;
            var currentPage = CV.voicesContainer.currentPage;

            if (currentPage > (totalVoices / perPage)) {
                return;
            }
            
            this.loadPage();
        },
        afterFetchActions: function(images){
            // this.voicesContainer.isotope('layout');
            this.progress.deactivate();
            
            this.updateSliderPosition();
        },
        updateSliderPosition: function () {
            var that = this,
                itemsOnViewport, itemsDate;

            itemsOnViewport = $.grep( that.voicesContainer.find('> .voice-box').not('.disabled'), function (n) {
                var viewportTop     = that.voiceScroller.offset().top,
                    viewportHeight  = that._body.height() - viewportTop,
                    itemTop         = $(n).offset().top;
                return itemTop < viewportHeight && itemTop > viewportTop;
            });

            itemsDate = _.map(itemsOnViewport, function(n, i) {
                return n.getAttribute('data-created-at').match(/[\d]{4}-[\d]{2}/)[0];
            });

            if (itemsDate.length) {
                var topYear = itemsDate[itemsDate.length - 1].match(/[\d]{4}/);

                this.slider.find('.linkable').removeClass('active').each(function() {
                    var that = this;

                    _.each(itemsDate, function(d, i) {
                        if (d == that.getAttribute('data-date').match(/[\d]{4}-[\d]{2}/)) {
                            $(that).addClass('active');
                        }
                    });

                });

                if (parseInt(topYear, 10) != parseInt(this.current_year, 10)) {
                    this._setYear(topYear, false);
                    this.updateSliderPosition();
                } else {
                    this.createCurrentYearLabel(topYear);
                }
            }
        },

        _createYearSliders: function() {
            var items = '',
                that = this,
                template = $('#timeline-deactivated').html(),
                year;
            this.min_year = 3000;
            this.max_year = 0;

            for (year in this.dates) {
                if (this.dates.hasOwnProperty(year)) {
                    year = parseInt(year, 10);
                    if (year > this.max_year) {
                        this.max_year = year;
                    }
                    if (year < this.min_year) {
                        this.min_year = year;
                    }
                }
            }
            for (year in this.dates) {
                if (this.dates.hasOwnProperty(year) && parseInt(year) != this.max_year) {
                    items = template.replace(/{{year}}/g, year) + items;
                }
            }
            if (items.length) {
                this.element.append(items);
                this.element.delegate('.disactivated-timeliner', 'click', function () {
                    that._setYear($(this).data('year'));
                    return false;
                });
            }
        },

        createCurrentYearLabel: function (year) {
            var cd = $('#current_date');
            cd.length && cd.remove();
            var yearHTML = ' \
                <li id="current_date"> \
                    <span class="year-label"> \
                        <span class="inner-dot-icn"></span> \
                        <span class="year-text">'+ year +'</span> \
                    </span> \
                </li>';
            this.slider.parent('li').before( yearHTML );
        },

        _setYear: function(year, scrollBody) {
            var y, movers, filter,
                diff = this.current_year - year,
                parent = this.slider.parent(),
                that = this;

            if (diff > 0) { // bottom year selected
                parent.nextAll('.disactivated-timeliner').filter(':lt('+diff+')').each(function () {
                    y = $(this).data('year') + 1;
                    $(this).data('year', y).find('.year-text').text(y).end().insertBefore(parent);
                });
            } else { // top year selected
                diff *= -1;
                parent.prevAll('.disactivated-timeliner').filter(':lt('+diff+')').each(function () {
                    y = $(this).data('year') - 1;
                    $(this).data('year', y).find('.year-text').text(y).end().insertAfter(parent);
                });
            }
            this.createCurrentYearLabel(year);
            this.current_year = year;
            this._updateSlider();

            if (scrollBody !== false) {
                this.scrollToDate(this.currentYearDates()[this.currentYearDates().length - 1]);
            }
        },

        _createSliderThicks: function() {
            var date, month, next_month, dateparts, day,
                that            = this,
                dates_length    = this.currentYearDates().length,
                emptyMonthStart = '<li class="empty-month"><span class="month-label short">',
                emptyMonthMid   = '</span><span class="month-label-complete">',
                emptyMonthEnd   = '</span></li>',
                i               = 0,
                first_thick     = dates_length > 150 ? function () {return false;} : function () {return i == 0;},
                month_days_counter = 0,
                timelineMonths = [];

            i = 1;

            while (i <= this.months.length - 1) {
                timelineMonths.push(emptyMonthStart + that.months[i] + emptyMonthMid + that.monthsFullNames[i] + ' ' + emptyMonthEnd);
                i += 1;
            }

            i = dates_length - 1;

            for (; i >= 0; i--) {
                date = this.currentYearDates()[i];
                dateparts = (/\d{4}-(\d{2})-(\d{2})/).exec(date);
                month = parseInt(dateparts[1], 10);
                day = dateparts[2];

                if (i > 0) {
                    next_month = parseInt((/\d{4}-(\d{2})-\d{2}/).exec(this.currentYearDates()[i - 1])[1], 10);
                }

                if (month === next_month || first_thick()) {
                    month_days_counter += 1;
                    if (month_days_counter === 1) {
                        timelineMonths[month - 1] = '<li class="linkable cv-dynamic-text-color" data-date="'+
                                                        date +
                                                    '"><span class="month-label short">' +
                                                        this.months[month] +
                                                    '</span><span class="month-label-complete">' +
                                                        this.monthsFullNames[month] + date.substr(0,4) +
                                                    '</span></li>';
                    }
                } else {
                    month_days_counter = 0;
                }
            }

            this.slider_thicks.html(timelineMonths.reverse().join(''))
                .find('> li').addClass("value-dot").end()
                .find('ul > li').addClass("values-sep-dot");

            this.slider_thicks.find('.linkable').bind('click', function () {
                that.scrollToDate($(this).data('date'));
                return false;
            });
        },

        parseDate: function(date) {
            var dateparts = (/\d{4}-(\d{2})-(\d{2})/).exec(date),
                month = parseInt(dateparts[1], 10);
                day = dateparts[2];
            return this.months[month] + ' ' + day;
        },

        scrollToDate: function (date, callback) {
            this.loadDate(date, callback);
        },
        scrollByY: function(delta){
            var currentScrollPos    = this.voiceScroller[0].scrollTop,
                newScrollPos        = currentScrollPos + delta;
            this.voiceScroller[0].scrollTop = newScrollPos;
        },
        _updateSlider: function() {
            this._createSliderThicks();
        },

        currentYearDates: function() {
            return Array.apply(null, this.dates[this.current_year.toString()]).reverse();
        },

        _createSlider: function() {
            var that = this,
                headerHeight = this.mainHeader.height();
            this.current_year = this.max_year;

            this.slider_thicks = $('<ul class="slider-values"/>').appendTo(this.slider);
            this._updateSlider();
            this.topScroller.css('top', headerHeight)
                .hover(function () {
                    that.autoScrollOn = true;
                    that._autoScroll(-70, false);
                }, function () {
                    that.autoScrollOn = false;
                });
            this.bottomScroller.css('bottom', 0)
                .hover(function () {
                    that.autoScrollOn = true;
                    that._autoScroll(70, false);
                }, function () {
                    that.autoScrollOn = false;
                });
        },

        _autoScroll: function (delta) {
            return;

            // var that = this;
            // if (!this.sliding) {
            //     this.scrollByY(delta);
            //     if (this.autoScrollOn) {
            //         setTimeout(function () {
            //             that._autoScroll(delta);
            //         }, 50);
            //     }
            // }
        },

        _setHeight: function() {
            var headerHeight = this.mainHeader.height();

            this.voiceScroller.css('height', window.innerHeight - headerHeight);
        }
    }
});
