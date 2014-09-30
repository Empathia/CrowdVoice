Class('DragBar')({
    prototype : {
        init : function (element, eventReceiver){
            this.element            = element; //$('.drag-handle')
            this.eventReceiver      = eventReceiver;// $('.timeline-wrapper')
            this.timelineContainer  = this.eventReceiver.find('.timeline-container');
            this.leftPosition       = this.element.offset().left; //initial position reference
            this.sidebarControl     = $('.tab-controller');

            this.setDragbarWidth();
            this.bindEvents();
            return true;
        },
        bindEvents : function(){
            var that = this;
            $(window).resize(function() {
                that.setDragbarWidth();
            });
            this.timelineContainer.bind('drag:update', function(ev,data) {
                that.moveDragbar(that.timelineContainer.position().left);
            });
        },
        moveDragbar: function(timelinePosition) {
            var timelineWidth   = this.timelineContainer.outerWidth(true),
                sidebarGap      = this.sidebarControl.outerWidth(true) + this.sidebarControl.offset().left,
                proportion      = timelineWidth / this.eventReceiver.innerWidth(),
                amount          = Math.abs(timelinePosition/proportion);
            this.element.css('left', amount);
        },
        setDragbarWidth: function() {
            var timelineWidth = this.timelineContainer.outerWidth(true),
                viewportWidth = this.eventReceiver.innerWidth(),
                dragBarWidth  = (viewportWidth * 100) / timelineWidth;
            this.element.css({'width':dragBarWidth + '%','display':'block'});
            if (dragBarWidth === 100) {
                this.element.hide();
            }
            this.setDraggable(this.element.outerWidth(true));
        },
        setDraggable: function(dragBarWidth) {
            var that                = this,
                sidebarGap          = this.sidebarControl.outerWidth(true) + this.sidebarControl.offset().left,
                viewportLimit       = this.eventReceiver.innerWidth() - dragBarWidth + sidebarGap,
                containment         = [sidebarGap, null, viewportLimit, null],
                draggableOptions    = {
                    axis        : 'x',
                    containment : containment,
                    drag        : function(ev, ui) {
                        that.moveTimeline(ui.offset.left);
                    }
                };
            this.element.draggable('destroy');
            this.element.draggable(draggableOptions);
        },
        moveTimeline: function(dragbarPosition) {
            var viewport        = this.eventReceiver,
                viewportWidth   = viewport.width(),
                timelineDragArea= this.timelineContainer.outerWidth(true) - viewportWidth,
                draggableWidth  = this.element.width(),
                draggablePos    = this.element.position().left,
                dragbarSpace    = viewportWidth - draggableWidth, //100%
                leftPosPercent  = (draggablePos * 100) / dragbarSpace,
                leftPosinPx     = ((timelineDragArea * leftPosPercent) / 100)*-1;
            this.timelineContainer.css('left', leftPosinPx);
        }
    }
});