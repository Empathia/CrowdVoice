Class('TimelineWidthController')({
    /*jshint multistr: true */
    YEAR_HOLDER: '<div class="year-container">\
                    <div class="months-container"></div>\
                    <div class="year-value-container"></div>\
                </div>',
    MONTH_HOLDER: '<div class="month"></div>',
    DAY_HOLDER: '<div class="day">\
                    <div class="top-timeline">\
                        <div class="element-container"></div>\
                    </div>\
                    <div class="bottom-timeline">\
                        <div class="event-container"></div>\
                    </div>\
                </div>',
    ELEMENT_HOLDER: '<div class="element">\
                        <img src="" class="element-image">\
                        <div class="element-details">\
                            <div class="date"></div>\
                            <div class="title"></div>\
                        </div>\
                    </div>\
                    <div class="pipeline">\
                        <i class="marker"></i>\
                    </div>',
    EVENT_HOLDER:   '<div class="event">\
                    <div class="event-info">\
                        <img src="" class="event-image">\
                        <div class="event-text">\
                            <div class="title"></div>\
                            <div class="content"></div>\
                        </div>\
                        <div class="tooltip-marker"></div>\
                    </div></div>',
    prototype: {
        init: function(element){
            this.element            = element; //$('.timeline-container')
            this.currentVoice       = currentVoice;
            this.timelineFragment   = document.createDocumentFragment();
            this.monthNames         = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
            this.bindEvents();
            this.getData();
        },
        bindEvents: function() {
            var that = this;
            this.element.bind('data:retrieved', function(){
                that.createTimespan();
            }).bind('timespan:created', function(){
                that.applyData();
                that.applyFragment();
            }).bind('timeline:ready', function() {
                that.updateDimensions();
            }).bind('gap:fill', function(){
                if (that.isIE() || navigator.appVersion.indexOf("MSIE 10") != -1) {
                    that.dimensionsForIE();
                }
            });
        },
        getData: function () {
            var that = this;
            var url = '/api/data.json?voice_id='+this.currentVoice.id;
            $.ajax({
                url: url,
                success: function(data, status, jqXHR){
                    that.timelineData = data;
                    that.getTimeSpan(data);
                    that.element.trigger('data:retrieved', data);
                }
            });
        },
        getTimeSpan: function(data) {
            var today           = new Date(),
                currentMonth    = today.getUTCMonth() < 10 ? '0'+(today.getUTCMonth()+1) : today.getUTCMonth()+1,
                currentDay      = today.getUTCDate() < 10 ? '0'+today.getUTCDate() : today.getUTCDate(),
                startDate       = '' + today.getUTCFullYear() + currentMonth + currentDay,
                endDate         = 0,
                timeSpan        = {
                    initialDate: { year: '0', month: '0', day: '0' },
                    endDate: { year: '0', month: '0', day: '0' }
                };

            for (var i=0; i <= data.events.length - 1; i++) {
                year    = data.events[i].event_date.substring(0,4);
                month   = data.events[i].event_date.substring(5,7);
                day     = data.events[i].event_date.substring(8,10);

                var currentDate = year + month + day;
                if (currentDate < startDate) {
                    startDate = currentDate;
                }
                if (currentDate > endDate) {
                    endDate = currentDate;
                }
            }

            timeSpan.initialDate.year   = startDate.substring(0,4);
            timeSpan.initialDate.month  = startDate.substring(4,6);
            timeSpan.initialDate.day    = startDate.substring(6,8);

            timeSpan.endDate.year   = endDate.substring(0,4);
            timeSpan.endDate.month  = endDate.substring(4,6);
            timeSpan.endDate.day    = endDate.substring(6,8);
            this.timeSpan = timeSpan;
            return this.timeSpan;
        },
        createTimespan: function() {
            var yearsInSpan = this._getYears();
            this._createYears();
            for (var year in yearsInSpan){
                var events = this.timelineData.events,
                    yearHasEvents = false;
                for (var count in events){
                    var yearInEvent = events[count].event_date.substring(0,4);
                    if (yearInEvent == yearsInSpan[year]){
                        yearHasEvents = true;
                    }
                }
                this._createMonths(yearsInSpan[year]);
            }
            this.element.trigger('timespan:created');
        },
        _createYears: function() {
            var year;
            for (year in this.yearsInSpan) {
                var yearHolder  = $(this.constructor.YEAR_HOLDER);
                yearHolder.addClass('year-'+this.yearsInSpan[year])
                    .find('.year-value-container')
                        .html(this.yearsInSpan[year]);
                this.timelineFragment.appendChild(yearHolder[0]);
                yearHolder = null;
            }
        },
        _getYears: function() {
            var startYear = parseInt(this.timeSpan.initialDate.year, 10);
            var endYear   = this.timeSpan.endDate.year;
            var today     = new Date();
            var yearsArray = [];
            var yearsCount, i, currentYear;
            if (!endYear || endYear === '') {
                endYear = today.getFullYear();
            }
            yearsCount = endYear - startYear;
            for (i = 0; i <= yearsCount; i++) {
                currentYear = startYear + i;
                yearsArray.push(currentYear);
            }
            this.yearsInSpan = yearsArray;
            return yearsArray;
        },
        _createMonths: function(year) {
            var lastMonth           = 12;
            var monthSettings       = { year: year};
            monthSettings.target    = this.timelineFragment.querySelector('.year-'+year+' .months-container');
            for (var i = 1; i <= lastMonth; i++) {
                monthSettings.iteration = i;
                this._createMonth(monthSettings);
            }
        },
        _createMonth: function(opts){
            var monthTemplate   = $(this.constructor.MONTH_HOLDER).addClass('month-'+opts.iteration)[0],
                monthData       = { year:opts.year, month:opts.iteration},
                monthReceiver   = opts.target;
            monthReceiver.appendChild(monthTemplate);
            monthTemplate = null;
            monthReceiver = null;
            this._createDays(monthData);
        },
        _createDays: function(opts){
            var lastDay = 31,
                daySettings = {year:opts.year, month:opts.month};
            daySettings.target = this.timelineFragment.querySelector('.year-'+opts.year+' .month-'+opts.month);
            for (var i = 1; i <= lastDay; i++) {
                daySettings.iteration = i;
                this._createDay(daySettings);
            }
        },
        _createDay: function(opts){
            var dayTemplate   = $(this.constructor.DAY_HOLDER).addClass('day-'+opts.iteration)[0],
                dayData       = { year:opts.year, month:opts.month, day: opts.iteration},
                dayReceiver   = opts.target;
            dayReceiver.appendChild(dayTemplate);
            dayReceiver = null;
            dayTemplate = null;
        },
        applyFragment: function(){
            this.element[0].appendChild(this.timelineFragment.cloneNode(true));
            this.element.trigger('timeline:ready');
        },
        applyData: function () {
            var eventsArr       = this.timelineData.events;

            for (var item in eventsArr) {
                var tl_event = eventsArr[item],
                    eventYear   = tl_event.event_date.substring(0,4),
                    eventMonth  = tl_event.event_date.substring(5,7),
                    eventDay    = tl_event.event_date.substring(8,10),
                    eventDate = { year:eventYear, month:eventMonth, day:eventDay};
                if (tl_event.is_event){
                    this.applyEvent(tl_event, eventDate, item);
                } else {
                    this.applyElement(tl_event, eventDate, item);
                }
            }
        },
        applyEvent: function(event, date, iteration) {
            var eventTemplate   = $(this.constructor.EVENT_HOLDER),
                eventImg        = eventTemplate.find('.event-image'),
                eventTitle      = eventTemplate.find('.title'),
                eventContent    = eventTemplate.find('.content'),
                dateMonth       = parseInt(date.month, 10) > 9 ? date.month : date.month.substring(1,2),
                dateDay         = parseInt(date.day, 10) > 9 ? date.day : date.day.substring(1,2),
                targetQuery     = '.year-'+date.year+' .month-'+dateMonth+' .day-'+dateDay,
                containerQuery  = '.year-'+date.year+' .month-'+dateMonth+' .day-'+dateDay + ' .event-container',
                target          = this.timelineFragment.querySelector(targetQuery),
                container       = this.timelineFragment.querySelector(containerQuery),
                targetIsUsed    = target.className.indexOf('only-event') > -1, oldQuery, newQuery;
                // description     = this._removeHTML(event.description);
            if (targetIsUsed){
                oldQuery = '.day-'+date.day + ' .event-container';
                newQuery = '.ev-index-'+iteration + ' .event-container';

                $(target).clone().addClass('ev-index-'+iteration)
                    .removeClass('full')
                    .insertAfter($(target))
                    .find('.event-image').attr('src', event.background_image).end()
                    .find('.title').html(event.event_date).end()
                    .find('.content').html(event.description).end()
                    .find('.element, .pipeline').remove();

                containerQuery   = containerQuery.replace(oldQuery, newQuery);
                container        = this.timelineFragment.querySelector(containerQuery);
            } else {
                eventImg.attr('src', event.background_image);
                eventTitle.html(event.event_date);
                eventContent.html(event.description).find('a').contents().unwrap();
                target.className = target.className + ' only-event';
                container.appendChild(eventTemplate[0]);
            }
        },
        applyElement: function(element, date, iteration) {
            var elementTemplate = $(this.constructor.ELEMENT_HOLDER),
                elemImg         = elementTemplate.find('.element-image'),
                elemDate        = elementTemplate.find('.date'),
                elemTitle       = elementTemplate.find('.title'),
                dateDay         = parseInt(date.day, 10) > 9 ? date.day : date.day.substring(1,2),
                dateMonth       = parseInt(date.month ,10) > 9 ? date.month : date.month.substring(1,2),
                targetQuery     = '.year-'+date.year+' .month-'+dateMonth+' .day-'+dateDay,
                containerQuery  = '.year-'+date.year+' .month-'+dateMonth+' .day-'+dateDay + ' .element-container',
                target          = this.timelineFragment.querySelector(targetQuery),
                container       = this.timelineFragment.querySelector(containerQuery),
                targetIsUsed    = target.className.indexOf('full') >= 0, oldQuery, newQuery;

            elementTemplate.not('.pipeline').attr('id', 'element-'+element.id);
            elemImg.attr('src',element.background_image);

            elemDate.html(this.monthNames[dateMonth-1] + ' ' + dateDay + ', ' + date.year);
            elemTitle.html(element.name);

            if (targetIsUsed){
                oldQuery = '.day-'+dateDay + ' .element-container';
                newQuery = '.el-index-'+iteration + ' .element-container';

                $(target).clone()
                    .addClass('el-index-'+iteration).insertAfter($(target))
                    .find('.element').remove().end()
                    .find('.pipeline').remove().end()
                    .find('.event').remove();

                containerQuery   = containerQuery.replace(oldQuery, newQuery);
                container        = this.timelineFragment.querySelector(containerQuery);
            } else {
                target.className = target.className.replace(/\bonly-event\b/,'') + ' full iteration-'+iteration;
            }
            container.appendChild(elementTemplate[0]);
            container.appendChild(elementTemplate[2]);
        },
        updateDimensions: function() {
            var timelineWidth = 0;
            this.element.find('.month').each(function(){
                // timelineWidth += this.offsetWidth;
                timelineWidth += $(this).outerWidth(true);
            });
            this.element.css('width', timelineWidth + 1 );
            this.element.trigger('width:update');
        },
        fillViewportGap: function(){
            var monthContainers     = this.element.find('.month'),
                monthsCount         = monthContainers.length,
                viewportWidth       = this.element.parent().width(),
                monthsWidth         = 0,
                distributedGap      = 0,
                currentWidth, gap;
            monthContainers.attr('style','');
            for (var i=0; i < monthsCount; i++){
                monthsWidth = monthsWidth + monthContainers[i].offsetWidth;
            }
            if (viewportWidth > monthsWidth){
                gap = viewportWidth - monthsWidth;
                distributedGap = distributedGap + gap / monthsCount;
                for (var j=0; j < monthsCount; j++){
                    var originalWidth   = monthContainers[j].offsetWidth,
                        newWidth        = Math.ceil(originalWidth + distributedGap) + 'px';
                    monthContainers[j].style.width = newWidth;
                }
            }
            this.element.trigger('width:update');
            // this ugly hack is due IE9 breaking the timeline when hovering elements
            // even when its outer/inner width isn't touched at all
            // what it does is hardcode dimensions to year/months/month containers
            // so when the misterious expanding occurs it doesn't move from its original
            // position, unfortunately this taxes load/resize performance for IE users
            if (this.isIE() || navigator.appVersion.indexOf("MSIE 10") != -1) {
                this.dimensionsForIE();
            } else {
                this.updateDimensions();
            }
            this.updateTimelinePos();
        },
        isIE: function(){
            var undef,
                v = 3,
                div = document.createElement('div'),
                all = div.getElementsByTagName('i');

            while (
                div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
                all[0]
            );
            return v > 4 ? v : undef;
        },
        dimensionsForIE: function(){
            this.element.find('.year-container').each(function(){
                var year            = $(this),
                    monthContainer  = year.find('.months-container'),
                    months          = monthContainer.find('.month'),
                    containerWidth  = 0;

                for (var i=0; i < months.length; i++){
                    var curentMonth         = $(months[i]),
                        curentMonthWidth    = curentMonth.width(),
                        monthWidth          = 31;
                    curentMonth.find('.day').each(function(){
                        dayWidth   = $(this).outerWidth(true);
                        monthWidth = monthWidth + dayWidth;
                        $(this).css('width', dayWidth);
                    });
                    if (curentMonthWidth > monthWidth) {
                        monthWidth = curentMonthWidth;
                    }
                    containerWidth = containerWidth + (monthWidth + 5);
                    $(months[i]).css('width', monthWidth + 5);
                }
                monthContainer.css('width', containerWidth);
                year.css('width', containerWidth);
            });
            this.updateDimensions();
        },
        updateTimelinePos: function(){
            var that                = this,
                viewportWidth       = this.element.parent().width(),
                timelineRightGap    = viewportWidth - this.element.outerWidth(true) - this.element.position().left,
                timelineOffset      = this.element.width() - viewportWidth;
            if ( timelineRightGap > 0 ) {
                TweenLite.to(this.element, 0.5, {left:'+='+timelineRightGap});
            }
        }
    }
});
