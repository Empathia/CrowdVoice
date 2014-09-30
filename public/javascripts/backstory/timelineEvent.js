Class('TimelineEvent').includes(Widget)({
    prototype : {
        init : function (element, eventReceiver){
            this.element        = element;//$('.event')
            this.eventReceiver  = eventReceiver;//$('.timeline-container');
            this.eventInfo      = this.element.find('.event-info');
            this.eventImage     = this.eventInfo.find('.event-image');
            this.tooltipMarker  = this.element.find('.tooltip-marker');
            this.mainSidebar    = $('.sidebar-wrapper');
            this.sidebarWidth   = this.mainSidebar.width();
            this.bindEvents();

            return true;
        },
        bindEvents : function(){
            var that = this;
            this.element.bind('mouseenter', function(){
                if ( !that.eventReceiver.hasClass('ui-draggable-dragging') ){
                    that.showTooltip();
                }
            }).bind('mouseleave', function(){
                that.hideTooltip();
            }).bind('click', function(){
                if ( that.eventReceiver.hasClass('ui-draggable-dragging') ){
                    that.hideTooltip();
                }
            });
        },
        showTooltip: function(){
            var that            = this,
                sidebarGap      = this.sidebarWidth + this.mainSidebar.offset().left,
                viewport        = this.eventReceiver.parent(),
                tabGap          = viewport.offset().left + parseInt(viewport.css('margin-left'), 10),
                viewportLimit   = viewport.innerWidth(),
                markerMargin    = parseInt(this.tooltipMarker.css('margin-left'), 10),
                eventPos        = this.element.offset().left + 18 - sidebarGap,
                tooltipL, tooltipR, newMarkerMargin;

                this.tooltipMarker.css('opacity', '0');
                this.eventInfo.css({'left': eventPos, 'display':'block'});
                // these values represent the boundaries of the tooltip box, relative to the viewport
                tooltipL        = this.eventInfo.offset().left - tabGap;
                tooltipR        = this.eventInfo.offset().left + this.eventInfo.width() - tabGap;

            if (tooltipL < 0){
                eventPos = eventPos + Math.abs(tooltipL) + 10;
            } else if (tooltipR > viewportLimit) {
                var overflow = viewportLimit - tooltipR;
                eventPos = eventPos + overflow - 20;
            }
            if (this.tooltipMarker.offset().left !== eventPos) {
                newMarkerMargin = markerMargin + (this.tooltipMarker.offset().left - eventPos) - sidebarGap;
            }
            this.eventInfo.css({'opacity':'0','left':eventPos});
            this.tooltipMarker.css({'margin-left':newMarkerMargin, 'opacity':'1'});
            TweenLite.to(this.eventInfo, 0.3, {opacity:1});
        },
        hideTooltip: function(){
            var that         = this;
            TweenLite.to(this.eventInfo, 0.3, {
                opacity    : 0,
                onComplete : function() {
                    that.tooltipMarker.css('margin-left', '');
                    that.eventInfo.removeAttr('style');
                }
            });
        }
    }
});