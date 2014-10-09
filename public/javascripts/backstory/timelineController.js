Class('TimelineController')({
    prototype: {
        detailViewSelector: '.detailed-view-wrapper',
        onboardingOverlay: '.overlay-mask',
        init: function(element, options){ // $('.timeline-wrapper')
            this.element           = element;
            this.dragBar           = this.element.find('.drag-handle');
            this.detailsElem       = $(this.detailViewSelector);
            this.elemsNavigation   = $('.elements-navigation');
            this.nextElem          = $('.elements-navigation.next');
            this.prevElem          = $('.elements-navigation.prev');
            this.timelineContainer = this.element.find('.timeline-container');
            // info box elements
            this.infoBox           = $('.voice-info');
            // sidebar elements
            this.sidebarWrapper    = $('.sidebar-wrapper');
            this.sidebar           = $('.voice, hgroup');
            this.sidebarControl    = $('.tab-controller');
            // overlay and onboarding
            this.overlayMask       = $('.overlay-mask');
            this.dismissOnboarding = this.overlayMask.find('.dismiss-onboarding');
            this.currentVoice      = currentVoice;
            // outer elements
            this.suggestButton     = $('.suggest-event');
            this.mainHeader        = $('.main-header');

            /* DEFAULT BEHAVIORS */
            new Tooltip('.widget', { hover: true });
            new BlogWidget();

            DynamicMeasures.update();
            // this.sidebarBehaviors();
            /* DEFAULT BEHAVIORS END */

            this.widthController    = new TimelineWidthController(this.timelineContainer);
            this.slideController    = new TimelineSlideController(this.element);
            this.detailedView       = new DetailsViewController(this.detailsElem);
            this.elementsController = new TimelineElementController(this.timelineContainer);
            this.eventsController   = new TimelineEventController(this.timelineContainer);

            this.currentElement     = null;
            // TODO listen to an event when the sidebar is actually done animating
            this.sidebarToggleTime  = 300;
            this.timelineElements   = [];

            this.bindEvents();
            this.showOnboarding();

        },
        bindEvents: function() {
            var that = this;
            /*
                Detailed view's navigation through elements
            */
            this.nextElem.bind('click', function(){
                that.goToNextElement();
            });
            this.prevElem.bind('click', function(){
                that.goToPrevElement();
            });
            $(window).bind('keyup', function(ev){
                if (!that.detailedView.isHidden) {
                    if (ev.which == 39) {
                        that.goToNextElement();
                    } else if (ev.which == 37) {
                        that.goToPrevElement();
                    } else if(ev.which == 27) {
                        that.hideDetailView();
                        that.detailedView.shrinkView();
                    }
                }
            }).bind('keydown', function(ev){
                if (that.detailedView.isHidden) {
                    that.moveTimeline(ev.which);
                }
            }).bind('focus', function(ev){
                that.resizeTimeline(ev);
            }).resize(function(ev){
                that.resizeTimeline(ev);
            });
            /*
                Timeline events to show overlay, and detailed view
            */
            this.timelineContainer.bind('width:update', function() {
                that.slideController.updateDraggable();
            }).bind('data:retrieved', function(ev,data){
                that.timelineData = data;
            }).bind('element:click', function(ev, data){
                that.showDetailView(data);
            }).bind('event:mouseenter', function(){
                that.enableOverlay();
            }).bind('event:mouseleave', function(){
                that.disableOverlay();
            }).bind('timeline:ready', function(){
                that.widthController.fillViewportGap();
                that.setTimelineHeight();
                that.adaptBackground();
            });
            /*
                Onboarding overlay events
            */
            this.dismissOnboarding.bind('click', function(){
                that.disableOverlay();
            });
            /*
                Sidebar events
            */
            this.sidebarControl.bind('sidebar.showBar sidebar.hideBar', function(ev){
                that.resizeTimeline(ev);
            });
            /*
                Detailed view inner events
            */
            this.detailsElem.bind('details:getElementData', function(ev, data){
                that.filterElementData(data);
            }).bind('element:mention', function(ev, data){
                // that.highlightElement(data);
            }).bind('detailView:close', function(ev, data){
                that.hideDetailView(data);
            }).bind('gallery:switch', function(){
                // that.elementsController.resetElements();
            }).bind('elements:reset', function(){
                that.elementsController.resetElements();
            });

            this.sidebarWrapper.bind('sidebar.toggle', function sidebarToggle() {
                that.slideController.updateDraggable();
                that.setTimelineHeight();
            });
        },
        adaptBackground: function() {
            var that            = this,
                bgWrapper       = this.element.find('.backdrop-image'),
                bgImage         = bgWrapper.css('background-image'),
                bgImageUrl      = /^url\((['"]?)(.*)\1\)$/.exec(bgImage),
                imgPath         = bgImageUrl ? bgImageUrl[2] : "",
                ghostBg         = this.element.find('.ghostBg');

            if (ghostBg.length) {
                if (ghostBg[0].complete) {
                    this._setBgDimensions();
                } else {
                    clearTimeout(this.backgroundTimeout);
                    this.backgroundTimeout = setTimeout(function(){
                        that.adaptBackground();
                    }, 50);
                }
                return;
            } else {
                this._createGhostBg(imgPath);
            }
        },
        _createGhostBg: function(bgImage) {
            var ghostBg     = $(document.createElement('img')).addClass('ghostBg')
                                .css({'visibility':'hidden', 'width': '100%'})
                                .attr('src',bgImage)
                                .appendTo(this.element);
            this.adaptBackground();
        },
        _setBgDimensions: function() {
            var ghostBg         = this.element.find('.ghostBg'),
                ghostHeight     = ghostBg.height(),
                windowHeight    = this.element.height(),
                bgWrapper       = this.element.find('.backdrop-image');
            if (ghostHeight < windowHeight) {
                bgWrapper.css('background-size','auto 100%');
            } else {
                bgWrapper.css('background-size','100% auto');
            }
            ghostBg.remove();
        },
        resizeTimeline: function(event){
            var that            = this,
                windowWidth     = $(window).width(),
                wrapperWidth    = this.element.width(),
                wrapperGap      = this.element.outerWidth(true) - wrapperWidth;
                clearTimeout(that.timelineResizeTimeout);
            if (event.type === 'resize'){
                this.timelineResizeTimeout = setTimeout(function(){
                    that.adaptBackground();
                    that.widthController.fillViewportGap();
                    that.slideController.updateDraggable();
                }, 500);
            } else {
                this.timelineResizeTimeout = setTimeout(function(){
                    that.adaptBackground();
                    that.slideController.updateDraggable();
                    that.widthController.updateTimelinePos();
                }, this.sidebarToggleTime);
            }
            this.setTimelineHeight();
        },
        setTimelineHeight: function(){
            var that = this;
            clearTimeout(this.timelineHeightTimeout);
            this.timelineHeightTimeout = setTimeout(function(){
                var currentTop = that.mainHeader.outerHeight(true);
                that.element.css('top', currentTop);
                that.suggestButton.css('top', currentTop + 8);
            }, this.sidebarToggleTime);
        },
        highlightElement: function(index){
            var that = this,
                elemsArray = this.elementsController.timelineElements,
                elemPosInArray;
            // get the element position on the array
            for (var item in elemsArray) {
                if(elemsArray[item].id == index){
                    elemPosInArray = item;
                    item = elemsArray.length;
                }
            }
            // validate that item exists
            if (typeof elemPosInArray != 'undefined') {
                this.slideController.scrollToElement(index);
                this.elementsController.highlightElement(elemPosInArray);
            }
        },
        goToNextElement: function(){
            var nextElem = this.currentElement + 1;
            if (nextElem > this.timelineElements.length - 1) {
                nextElem = 0;
            }
            this.highlightElement(this.timelineElements[nextElem].id);
            this.showDetailView(nextElem);
        },
        goToPrevElement: function () {
            var prevElem = this.currentElement - 1;
            if (prevElem < 0) {
                prevElem = this.timelineElements.length - 1;
            }
            this.highlightElement(this.timelineElements[prevElem].id);
            this.showDetailView(prevElem);
        },
        moveTimeline: function(keyCode) {
            var availableSpaceR  =   this.timelineContainer.outerWidth(true) -
                                    Math.abs(this.timelineContainer.position().left) -
                                    this.element.outerWidth(true),
                newPos;
            // left key
            if (keyCode == 37) {
                newPos = -200;
                if (this.timelineContainer.position().left - newPos > 0) {
                    newPos = (this.timelineContainer.position().left - newPos) + newPos;
                }
            // right key
            } else if (keyCode == 39){
                newPos = 200;
                if (newPos > availableSpaceR) {
                    newPos = availableSpaceR;
                }
            } else {
                return false;
            }
            this.timelineContainer.trigger('timeline:updatePos',newPos);
        },
        showDetailView: function(elemIndex){
            var that = this;
            this.currentElement     = elemIndex;
            if (!this.timelineElements.length) {
                this.timelineElements   = that.elementsController.timelineElements;
            }
            if (this.timelineElements.length > 1 && this.detailedView.isHidden) {
                this.elemsNavigation.css({'opacity':0,'display':'block'});
                TweenLite.to(this.elemsNavigation, 0.5, {opacity:1});
            }
            this.detailedView.growView(this.timelineElements[elemIndex].id);
        },
        hideDetailView: function(index) {
            var that = this;
            this.elemsNavigation.fadeOut();
            index && this.slideController.scrollToElement(index);
        },
        showOnboarding: function(){
            var onboardingCookie = 'first_time_user';
            if (this._readCookie(onboardingCookie) === null) {
                this._createCookie(onboardingCookie, false, 365);
                this.enableOverlay(true);
            }
        },
        enableOverlay: function(showOnboarding, overlayType) {
            if (showOnboarding) {
                this.overlayMask.addClass('onboarding');
            }
            if (overlayType && overlayType === 'sidebar') {
                this.overlayMask.css({opacity:0,'display':'block', 'z-index':'2'});
            } else {
                this.overlayMask.css({opacity:0,'display':'block'});
            }
            TweenLite.to(this.overlayMask, 1, {opacity:'1'});
        },
        disableOverlay: function() {
            this.overlayMask.fadeOut('fast').removeClass('onboarding');
        },
        filterElementData: function(elemId){
            var that = this,
                timelineEvents = this.timelineData.events,
                elemData;
            for(var i=0; i < this.timelineData.events.length; i++){
                if (!timelineEvents[i].is_event){
                    timelineEvents[i].id == elemId ? elemData = timelineEvents[i] : null;
                }
            }
            this.detailsElem.trigger('timelineData:served', elemData);
        },
        // sidebarBehaviors: function(){
        //     this.sidebarWrapper = $('<div class="sidebar-wrapper">');
        //     this.sidebarWrapper.insertBefore('hgroup');
        //     this.sidebar.appendTo(this.sidebarWrapper);
        // },
        // bitten from http://www.quirksmode.org/js/cookies.html
        _createCookie: function(name, value, days) {
            var expires;
            if (days) {
                var date = new Date();
                date.setTime(date.getTime()+(days*24*60*60*1000));
                expires = "; expires="+date.toGMTString();
            } else {
                expires = "";
            }
            document.cookie = name+"="+value+expires+"; path=/";
        },
        _readCookie: function(name) {
            var nameEQ = name + "=";
            var ca = document.cookie.split(';');
            for(var i=0;i < ca.length;i++) {
                var c = ca[i];
                while (c.charAt(0)==' '){
                    c = c.substring(1,c.length);
                }
                if (c.indexOf(nameEQ) == 0){
                    return c.substring(nameEQ.length,c.length);
                }
            }
            return null;
        }
    }
});
