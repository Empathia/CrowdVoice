Class(CV, 'BackstoryTimeline').inherits(Widget)({
    HTML : '\
        <div class="cv-timeline-wrapper">\
            <div class="cv-timeline__background">\
                <div></div>\
            </div>\
            <div class="cv-timeline scroll-primary">\
                <div class="cv-timeline__inner"></div>\
            </div>\
            <div class="cv-timeline-fixed-buttons">\
                <a href="" target="_blank" class="cv-timeline__suggest-event-btn cv-button cv-dynamic-hover-text-color cv-button--small cv-button--light cv-uppercase">Suggest an Event</a>\
                <div class="related-backstories__wrapper">\
                    <a href="" class="related-backstories-button cv-button cv-dynamic-hover-text-color cv-button--small cv-button--light cv-uppercase with-arrow">\
                        Related Backstories \
                        <i class="cv-button--arrow-top"></i>\
                    </a>\
                </div>\
            </div>\
        </div>\
    ',
    SUGGESTION_MAILTO: "mailto:crowdvoice@mideastyouth.com?subject=I%20have%20a%20correction&body=I'd%20like%20to%20suggest%20a%20new%20event%20for%20the%20topic%20",

    prototype : {
        /**
         * Timeline element data holder
         * @property _data <private> [Object]
         */
        _data : null,

        /**
         * Holds the reference to the timeline element.
         * @property _timelineElement <private> [jQuery Object]
         */
        _timelineElement : null,
        _timelineInnerElement : null,

        /**
         * Holds the reference to the background element.
         * @property _backgroundElement <private> [jQuery Object]
         */
        _backgroundElement : null,

        _suggestEventButton : null,
        _eventCardsElements : null,
        _imageCovers : null,
        _scrollTimer : null,
        _spyScrollFlag : true,
        _resizeTimer : null,

        init : function init(config) {
            Widget.prototype.init.call(this, config);

            this._timelineElement = this.element.find('.cv-timeline');
            this._timelineInnerElement = this._timelineElement.find('.cv-timeline__inner');
            this._backgroundElement = this.element.find('.cv-timeline__background > div');
            this._suggestEventButton = this.element.find('.cv-timeline__suggest-event-btn');

            this._setupElements()._bindEvents();
        },

        _setupElements : function _setupElements() {
            if (window.relatedVoices.length > 0) {
                this._addRelatedBackstoriesDropdown();
            }

            return this;
        },

        _bindEvents : function _bindEvents() {
            $(window).bind('resize', this._resizeHandler.bind(this));
            this._timelineElement.bind('scroll', this._scrollHandler.bind(this));

            return this;
        },

        /**
         * Setup the elements and instanciate its children.
         * @method updateUI <public> [Function]
         */
        updateUI : function updateUI() {
            var lastElementItem;

            this._data = CV.BackstoryRegistry.getInstance().get();

            this._backgroundElement[0].style.backgroundImage = 'url(' + this.background + ')';
            this._suggestEventButton[0].href = this.constructor.SUGGESTION_MAILTO + this.voiceTitle;

            this._data.forEach(function(item) {
                this.appendChild(new CV.BackstoryTimelineYear({
                    name : 'year-' + item.year,
                    year : item.year,
                    months : item.months
                })).render(this._timelineInnerElement);
            }, this);

            this._eventCardsElements = this.element.find('.cv-timeline-cards__carousel-wrapper');
            this._imageCovers = this.element.find('.cv-timeline-element__gallery-frame > img');

            lastElementItem = this.children[this.children.length-1];
            lastElementItem = lastElementItem.element.find('.cv-timeline-month:last-child .cv-timeline-element:last-child');

            if (lastElementItem.find('> .cv-timeline-cards').length) {
                lastElementItem.css('min-width', 620);
            }

            this.updateHeightAndCenterVertically();
            this._scrollHandler();

            return this;
        },

        updateHeightAndCenterVertically : function updateHeightAndCenterVertically() {
            var eventsHeights, maxEventsHeight, timelineHeight, timelineWrapperHeight, defaultImageHeight, cardsOffsetHeight, topPositionValue;

            if (window.innerHeight <= 550) {
                /* minHeight => (99 = header, 40 = breadcrumb, 550 = minTimelineHeight) */
                timelineWrapperHeight = (550 - (99 + 40));
            } else {
                timelineWrapperHeight = this.element.height();
            }

            defaultImageHeight = 200;
            cardsOffsetHeight = 24;

            /* reset image cover sizes */
            this._imageCovers.each(function(i, e) {
                e.style.cssText = "";
            });

            /* get all event cards height */
            eventsHeights = this._eventCardsElements.map(function(i,e) {
                return e.getBoundingClientRect().height;
            });

            maxEventsHeight = CV.Utils.getMaxOfArray(eventsHeights);
            timelineHeight = ((maxEventsHeight - cardsOffsetHeight) + this._timelineInnerElement.height());
            diff = (timelineHeight - timelineWrapperHeight);

            if (diff > 0) {
                this._imageCovers.each(function(i, e) {
                    e.style.width = "auto";
                    e.style.height = (defaultImageHeight - diff) + "px";
                });
            }

            topPositionValue = (timelineWrapperHeight - (this._timelineInnerElement.height() + (maxEventsHeight - cardsOffsetHeight))) / 2;
            this._timelineInnerElement[0].style.top = topPositionValue + "px";

            eventsHeights = maxEventsHeight = timelineHeight = timelineWrapperHeight = defaultImageHeight = cardsOffsetHeight = topPositionValue = null;

            return this;
        },

        scrollTo : function scrollTo(_position) {
            var backstoryTimeline = this;

            this._spyScrollFlag = false;

            this._timelineElement.animate({
                scrollLeft : _position
            }, 400, function() {
                window.setTimeout(function() {
                    backstoryTimeline._spyScrollFlag = true;
                }, 260);
            });

            return this;
        },

        /**
         * Handles the scroll event. Looks for the BackstoryTimelineElement
         * closest to the left side of the screen and once detected,
         * activates the correct BackstoryBreadcrumItem.
         * @property _scrollHandler <private> [Function]
         * @return undefined
         */
        _scrollHandler : function _scrollHandler() {
            if (this._spyScrollFlag === false) {
                return false;
            }

            if (this._scrollTimer) {
                window.clearTimeout(this._scrollTimer);
            }

            this._scrollTimer = window.setTimeout(function() {
                var last, timelineScrollPosition;

                timelineScrollPosition = this._timelineElement[0].scrollLeft;

                this.children.some(function(year) {
                    return year.children.some(function(month) {
                        if (month.element[0].offsetLeft <= timelineScrollPosition) {
                            last = month;
                        } else return true;
                    });
                });

                last.children.some(function (day) {
                    var _el = day.element[0];

                    if ((day.parent.element[0].offsetLeft + _el.offsetLeft + _el.offsetWidth) > timelineScrollPosition) {
                        last = day;
                        return true;
                    }
                });

                window.CV.backstoryUIComponent.breadcrumb.activateItemByDate(~~last.data.year, ~~last.data.month);
                window.clearTimeout(this._scrollTimer);
            }.bind(this), 250);
        },

        _resizeHandler : function _resizeHandler() {
            var backstoryTimeline = this;

            if (this._resizeTimer) {
                window.clearTimeout(this._resizeTimer);
            }

            this._resizeTimer = window.setTimeout(function() {
                backstoryTimeline.updateHeightAndCenterVertically();
                window.clearTimeout(backstoryTimeline._resizeTimer);
            }, 250);
        },

        _addRelatedBackstoriesDropdown : function _addRelatedBackstoriesDropdown() {
            var fragment = document.createDocumentFragment(),
                relatedBackstoriesButton = this.element.find('.related-backstories-button');

            window.relatedVoices.map(function(r) {
                var anchorItem = document.createElement('a');

                anchorItem.href = window.location.origin + "/" + r.slug + "?backstory=true";
                anchorItem.appendChild(document.createTextNode(r.title));

                fragment.appendChild(anchorItem);
            });

            new CV.Tooltip({
                toggler : relatedBackstoriesButton,
                showOnCssHover : false,
                html : fragment,
                className : 'related-backstories-tooltip',
                position : 'top',
                nowrap : true,
                clickHandler : function(ev) {
                    if (this.active) {
                        this.deactivate();
                        this.toggler.removeClass('active');
                    } else {
                        this.activate();
                        this.toggler.addClass('active');
                    }

                    return false
                },
            }).render(this.element.find('.related-backstories__wrapper'));

            relatedBackstoriesButton.addClass('show');

            return this;
        }
    }
});
