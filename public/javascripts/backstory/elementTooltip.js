Class('ElementTooltip').includes(Widget)({
    prototype : {
        init : function (element, eventReceiver){//.element-details, .element
            this.element        = element;
            this.cloneWidth     = 225;
            this.eventReceiver  = eventReceiver;
            this.tooltipHolder  = $('.timeline-wrapper');
            this.mainSidebar    = $('.sidebar-wrapper');
            this.sidebarWidth   = this.mainSidebar.width();
        },
        _getTooltipXPos: function() {
            var that        = this,
                tooltipXPos = this.eventReceiver.offset().left - this.elemClone.offset().left + 25;
            return tooltipXPos;
        },
        _getOriginX: function() {
            var that            = this,
                windowWidth     = $(window).width(),
                sidebarGap      = this.sidebarWidth + this.mainSidebar.offset().left,
                originX         = (this.eventReceiver.offset().left - 80) - sidebarGap;// (tooltip width/2)-(element width/2)
            if (originX + this.cloneWidth > windowWidth) {
                var difference = (originX + this.cloneWidth) - windowWidth;
                originX = originX - difference;
            } else if (originX < 0) {
                originX = 0;
            }
            return originX;
        },
        _getOriginY: function() {
            var that        = this,
                elementTop  = this.eventReceiver.position().top,
                topTreshold = this.tooltipHolder.offset().top,
                tooltipHeight = this.elemClone.outerHeight(true),
                originY;
            // element top + (wrapper to container gap) - tooltipHeight - tooltip tail height
            originY     = elementTop - tooltipHeight - 20;

            return originY;
        },
        _activate: function(){
            var that            = this,
                tooltipMarker   = $('<div class="tooltip-marker">'),
                originX, originY, tooltipXPos;

            this.elemClone      = this.element.clone().addClass('details-clone')
                                      .appendTo(this.tooltipHolder);
            originX             = this._getOriginX();
            originY             = this._getOriginY();

            if (originY < 0) {
                originY =   originY +
                            this.elemClone.outerHeight(true) +
                            that.eventReceiver.outerHeight(true) +
                            40; // tooltip tail height - desired gap
                tooltipMarker.addClass('inverse');
            }

            this.elemClone.css({
                left: originX,
                top:originY
            });

            tooltipXPos         = this._getTooltipXPos();

            tooltipMarker.appendTo(this.elemClone).css('left',tooltipXPos);
            TweenLite.to(this.elemClone, 0.3, {
                opacity:1,
                overwrite: true,
            });
        },
        _deactivate: function(){
            var that = this;
            if (this.elemClone){
                that.removeClone();
            }
        },
        removeClone: function(){
            if(this.elemClone){
                this.elemClone.remove();
                this.elemClone = null;
            }
        }
    }
});