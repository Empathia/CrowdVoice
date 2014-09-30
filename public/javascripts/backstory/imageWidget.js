Class('ImageWidget').includes(Widget)({
    prototype : {
        init : function (element, eventReceiver, index){
            this.element        = element;//$('.img')
            this.container      = this.element.parent();
            this.eventReceiver  = eventReceiver;//$('.detailed-view-wrapper')
            this.itemIndex      = index;
            // this.mention        = this.element.data('mention');
            this.is_explicit    = this.element.data('explicit');
        },
        _activate: function() {
            var that = this,
                warningLength = this.container.find('.explicit-image-overlay').length;
            if (this.is_explicit && warningLength < 1){
                this._showWarning();
            }
            this.container.addClass('active');
            this.element.css({display:'block',opacity:0});
            this.eventReceiver.trigger('gallery:updateSize', this.element);
            TweenLite.to(this.element, 0.5, {
                opacity:1,
                onComplete: function(){
                    that.element.addClass('active');
                }
            });
            this.active = true;
        },
        _deactivate: function() {
            var that        = this,
                positionX   = this.element.position().left;
            if (this.active) {
                this.element.css({'position':'absolute','left':positionX});
                TweenLite.to(this.element, 0.5, {
                    opacity:0,
                    onComplete: function() {
                        that.container.removeClass('active');
                        that.element.removeAttr('style').removeClass('active');
                    }
                });
                this.active = false;
            }
        },
        _showWarning: function(){
            /*jshint multistr: true */
            var that    = this,
                warning =   '<div class="explicit-image-overlay">\
                                <div class="content-container">\
                                    <p class="title">Warning!</p>\
                                    <p class="description">This image may contain sensitive material.</p>\
                                    <button class="dismiss-explicit">Click To View</button>\
                                </div>\
                            </div>';
            $(warning).insertBefore(this.element);
            this.element.parent().find('.dismiss-explicit').bind('click', function(){
                that._removeWarning();
            });
        },
        _removeWarning: function(){
            var overlay = this.container.find('.explicit-image-overlay');
            TweenLite.to(overlay, 0.3, {
                opacity: 0,
                onComplete: function(){
                    overlay.remove();
                }
            });
            this.element.attr('data-explicit', 'false');
            this.is_explicit = false;
        }
    }
});