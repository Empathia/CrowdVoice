Class('TimelineSlideController')({
    prototype : {
        elementsWidth: 105,
        init : function (element){
            this.element            = element; // $('.timeline-wrapper')
            this.timelineContainer  = this.element.find('.timeline-container');
            this.dragHandle         = this.element.find('.drag-handle');
            this.sidebarControl    = $('.tab-controller');
            this.bindEvents();
        },
        bindEvents: function () {
            var that = this;
            this.timelineContainer.bind('drag:update', function() {
                that._reportOverflow();
            }).bind('timeline:ready', function(){
                that._createDragbar();
            });
            this.timelineContainer.bind('timeline:updatePos', function(ev,data){
                that.moveLeft(data);
            });
        },
        _createDragbar: function(){
            this.dragBar = new DragBar(this.dragHandle, this.element);
        },
        updateDraggable: function(){
            var that             = this,
                sidebarGap       = this.sidebarControl.outerWidth(true) + this.sidebarControl.offset().left,
                timelineWidth    = this.timelineContainer.outerWidth(true) + sidebarGap,
                viewportLimit    = timelineWidth - this.element.width() - (sidebarGap*2),
                containment      = [-viewportLimit, null, sidebarGap, null],
                draggableOptions = {
                    axis        : 'x',
                    delay       : 100,
                    containment : containment,
                    drag        : function() {
                        that.timelineContainer.trigger('drag:update', timelineWidth);
                    }
                };
            that.timelineContainer.trigger('drag:update', timelineWidth);
            this.timelineContainer.draggable('destroy');
            this.timelineContainer.draggable(draggableOptions);
            this.dragBar && this.dragBar.setDragbarWidth();
        },
        scrollToElement: function(elementId) {
            var day           = $('#element-'+elementId),
                dayPos        = day.offset().left + this.elementsWidth,
                timelinePos   = this.timelineContainer.position().left,
                amountToMove  = dayPos,
                viewportWidth = this.element.outerWidth(),
                dayDirection  = this.dayDirection(day),
                timelineWidth = this.timelineContainer.width(),
                difference;

            if (dayDirection === 'right') {
                amountToMove = amountToMove - viewportWidth;
                difference = timelineWidth - viewportWidth - amountToMove;
                if (difference < 0) {
                    amountToMove = amountToMove + difference;
                }
            } else if (!dayDirection) {
                return false;
            } else {
                // compensation gap for the left side
                amountToMove = amountToMove - 150;
            }
            this.moveLeft(amountToMove);
        },
        dayDirection: function(day){
            var dayWidth      = this.elementsWidth;
            // day's position relative the viewport
            var dayPos        = day.offset().left + dayWidth;
            var viewportWidth = this.element.outerWidth();

            if (dayPos < dayWidth || dayPos > viewportWidth) {
                if (dayPos < dayWidth) {
                    return 'left';
                } else {
                    return 'right';
                }
            }
        },
        moveLeft: function(amountToMove) {
            var that = this,
            animConf = { left:'-='+amountToMove };
            TweenLite.to(this.timelineContainer, 1, animConf);
            this.timelineContainer.trigger('drag:update');
        },
        _reportOverflow: function() {
            var that = this,
                timelineWidth   = this.timelineContainer.outerWidth(true),
                viewportWidth   = this.element.innerWidth(),
                timelinePos     = this.timelineContainer.position().left,
                overflowLeft    = timelinePos < 0,
                overflowRight   = (timelineWidth + timelinePos) - viewportWidth > 0;
            if (overflowLeft) {
                !that.element.hasClass('overflow-left') && that.element.addClass('overflow-left');
            } else {
                that.element.removeClass('overflow-left');
            }
            if (overflowRight) {
                !that.element.hasClass('overflow-right') && that.element.addClass('overflow-right');
            } else {
                that.element.removeClass('overflow-right');
            }
            return;
        }
    }
});