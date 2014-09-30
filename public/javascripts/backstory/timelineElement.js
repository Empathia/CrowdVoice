Class('TimelineElement').includes(Widget)({
    prototype : {
        maxHeight: 30,
        minHeight: 30,
        highlightClass: 'active',
        init : function (element, eventReceiver, iteration){
            this.element        = element;
            this.eventReceiver  = eventReceiver; // $('.timeline-container')
            this.arrayPos       = iteration;
            this.pipeline       = this.element.siblings('.pipeline');
            this.marker         = this.pipeline.find('.marker');
            this.id             = this.element[0].id.replace(/^\D+/g, '');
            this.tooltipElement = this.element.find('.element-details');

            this.tooltip        = new ElementTooltip(this.tooltipElement, this.element);

            this.isHovered      = false;
            this.isDimmed       = false;
            this.isBottom       = false;

            this.originals      = {
                pipeline: {
                    top: this.pipeline.css('top')
                },
                element: {
                    bottom: this.element.css('bottom')
                }
            };
            this.bindEvents();
            return true;
        },
        bindEvents : function(){
            var that = this;
            this.element.not('.busy').bind('mouseenter', function() {
                if (!that.element.hasClass('busy')){
                    that.tooltip.activate();
                    that.isHovered = true;
                    that.highlight();
                }
            }).bind('mouseleave', function () {
                that.tooltip.deactivate();
                if (!that.element.hasClass('busy') && !that.element.hasClass('current')){
                    that.isHovered = false;
                    that.resetStyles();
                }
            }).bind('mouseup', function(ev){
                that.tooltip.deactivate();
                if(!that.eventReceiver.hasClass('ui-draggable-dragging') && ev.which === 1){
                    that.eventReceiver.trigger('element:click', that.arrayPos);
                }
                that.resetStyles();
            }).bind('element:highlight', function(){
                that.highlight(true);
            }).bind('element:reset', function(){
                that.resetStyles(true);
            });
        },
        _activate: function() {
            // this.setHeight(true);
            this.isDimmed = false;
        },
        _deactivate: function() {
            // this.setHeight(false);
        },
        highlight: function(isCurrent) {
            var that = this;
            // if (isCurrent){
            //     this.element.addClass(that.highlightClass + ' current');
            // } else {
            //     this.element.addClass(that.highlightClass);
            // }

            TweenLite.to(this.element, 0.4, {
                opacity     : '1',
                transform   : 'scale(1.14)',
                borderColor : 'rgba(255, 255, 255, 1)'
            });

            TweenLite.to(this.pipeline, 0.3, {backgroundColor:'rgba(137,137,137,1)'});
            TweenLite.to(this.marker, 0.3, {background:'#ffffff'});
        },
        dim: function(){
            var that = this;
            if (!this.isHovered && !this.isDimmed){
                this.element.removeClass(this.highlightClass).addClass('busy');
                TweenLite.to(this.element, 0.3, {
                    opacity:'0.6',
                    onComplete: function(){
                        that.element.removeClass('busy');
                    }
                });
            }
            this.isDimmed = true;
        },
        resetStyles: function(wasCurrent) {
            var that = this;
            // wasCurrent && this.element.removeClass('current');
            // if (!this.element.hasClass('current')) {
            //     if (this.element.hasClass(this.highlightClass)) {
            //         this.element.addClass('busy');
                    TweenLite.to(this.element, 0.3, {
                        opacity     : '1',
                        transform   : 'scale(1)',
                        borderColor : 'rgba(255, 255, 255, 0.15)',
                        onComplete  : function(){
                            // that.element.removeAttr('style').removeClass('busy');
                            that.element.css('bottom','');
                        }
                    });
                // } else {
                //     this.element.attr('style') && this.element.removeAttr('style');
                // }

                TweenLite.to(this.pipeline, 0.3, {backgroundColor:'rgba(81,81,81,0.2)'});
                TweenLite.to(this.marker, 0.3, {
                    background:'#5f5f5f'
                    // onComplete: function(){
                        // that.marker.removeAttr('style');
                    // }
                });

                // this.element.removeClass(this.highlightClass);
                // this.isDimmed = false;
            // }
        },
        setHeight: function(toTall) {
            var that = this;
            this.element.removeClass(this.highlightClass).addClass('busy');
            if (toTall){
                TweenLite.to(this.element, 0.3, {
                    bottom: that.originals.element.bottom,
                    overwrite : 'all'
                });
                TweenLite.to(that.pipeline, 0.3, {
                    top :that.originals.pipeline.top,
                    onComplete: function(){
                        that.pipeline.removeAttr('style');
                    }
                });
                // remove classes anyways
                this.enableTimeout = setTimeout(function(){
                    that.element.removeClass('disabled busy');
                },500);
                this.isBottom = false;
            } else {
                if (!this.isBottom){
                    TweenLite.to(this.element, 0.3, {
                        bottom      :'8%',
                        overwrite : 'all',
                        onComplete  : function(){
                            that.element.addClass('disabled')
                                .removeClass(that.highlightClass+' busy')
                                .removeAttr('style');
                        }
                    });
                    TweenLite.to(this.pipeline, 0.3, {top:'92%'});
                }
                this.isBottom = true;
            }
        }
    }
});