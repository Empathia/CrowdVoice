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
        _scrollTimer : null,
        _spyScrollFlag : true,
        _resizeTimer : null,

        init : function init(config) {
            Widget.prototype.init.call(this, config);

            this._timelineElement = this.element.find('.cv-timeline');
            this._timelineInnerElement = this._timelineElement.find('.cv-timeline__inner');
            this._backgroundWrapperElement = this.element.find('.cv-timeline__background');
            this._backgroundElement = this._backgroundWrapperElement.find('> div');
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

            this._printMiniEvents();

            setTimeout(function(timeline) {
              lastElementItem = timeline.children[timeline.children.length-1];
              lastElementItem = lastElementItem.element.find('.cv-timeline-month:last-child .cv-timeline-element:last-child');

              if (lastElementItem.find('.cv-timeline-cards').length) {
                lastElementItem.css('min-width', 620);
              }

              timeline.updateHeightAndCenterVertically();
              timeline._scrollHandler();
            }, 0, this);

            return this;
        },

        /**
         * Iterates over all timeline's mini events and add them.
         * @private
         */
        _printMiniEvents: function() {
          var miniEvents = [];

          this.children.map(function(year) {
            miniEvents = miniEvents.concat(year.getMiniEvents());
          });

          miniEvents.map(this._addMiniEvent.bind(this));
        },

        /**
         * Proxy to add a specific mini event into the timeline chronologically.
         * @private
         * @param {Object} miniEvent - Mini event data.
         */
        _addMiniEvent: function(miniEvent) {
          var year = this['year-' + miniEvent.year];
          var months = year.getMonths();

          var _insertAt;

          months.slice().reverse().some(function(month) {
            _insertAt = month.canEventBeInserted(miniEvent);
            if (_insertAt) return true;
          });

          if (_insertAt) return _insertAt.addMiniEvent(miniEvent);

          year.tryToInsertEventPrev(miniEvent);
        },

        updateHeightAndCenterVertically : function updateHeightAndCenterVertically() {
          var topPositionValue = (this.element.height() - (this._timelineInnerElement.height())) / 2;

          if (topPositionValue < 0) topPositionValue = 0;
          this._timelineInnerElement[0].style.top = topPositionValue + "px";

            /* resize background image container */
          var bh = (this.element[0].querySelector('.cv-timeline-element__info-wrapper').offsetTop + topPositionValue + 10);
          this._backgroundWrapperElement[0].style.height = bh + "px";

          return this;
        },

        getLeftOffset : function getLeftOffset() {
            var scrollLeft = this._timelineElement.scrollLeft();
            var offsetLeft = this._timelineElement.offset().left;

            return scrollLeft - offsetLeft;
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

            var timeline = this._timelineElement;

            this._scrollTimer = window.setTimeout(function() {
                var last, timelineScrollPosition, sidebarWidth;

                timelineScrollPosition = timeline[0].scrollLeft;
                sidebarWidth = timeline.offset().left;

                this.children.some(function(year) {
                    return year.children.some(function(month) {
                        var mdimensions = month.element.offset().left + (month.element[0].offsetWidth - 16);

                        if ((timelineScrollPosition + mdimensions - sidebarWidth) >= timelineScrollPosition) {
                            last = month;
                            return true;
                        }
                    });
                });

                window.CV.backstoryUIComponent.breadcrumb.activateItemByDate(~~last.year, ~~last.month);
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

                    return false;
                },
            }).render(this.element.find('.related-backstories__wrapper'));

            relatedBackstoriesButton.addClass('show');

            return this;
        }
    }
});
