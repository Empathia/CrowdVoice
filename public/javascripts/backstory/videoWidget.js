Class('VideoWidget').includes(Widget)({
    prototype : {
        init : function (element, eventReceiver, index){
            this.element        = element;
            this.eventReceiver  = eventReceiver;
            this.itemIndex      = index;
            // this.mention        = this.element.data('mention');
            // this.source         = this.element.prop('src').indexOf('wmode') < 0 ? this.element.prop('src')+'?wmode=transparent' : this.element.prop('src');
            this.source         = this.element.attr('data-origin').indexOf('wmode') < 0 ? this.element.attr('data-origin')+'?wmode=transparent' : this.element.attr('data-origin');
            this.id             = this.element.prop('id');
            this.origin         = window.location.origin;
            this.container      = this.element.parent();
            this.is_explicit    = this.element.data('explicit');
        },
        _activate: function() {
            var that            = this,
                warningLength   = this.container.find('.explicit-video-overlay').length,
                player, onPlayerReady;
            if (this.is_explicit && !warningLength){
                this._showWarning();
            }
            if (!this.active) {
                this.container.addClass('active');
                this.element.addClass('active');
                this.active = true;
            }
            if (!this.player) {
                onPlayerReady = function onPlayerReady(ev){
                    that.player = ev.target;
                };
                player = new YT.Player(this.id, {
                    autohide : 1,
                    controls : 0,
                    height   : this.element.parent().height()+'',
                    origin   : this.origin,
                    videoId  : this.id.replace('video_',''),
                    width    : this.element.parent().width()+'',
                    events   : {
                      'onReady': onPlayerReady
                    }
                });
                this.element.prop('src',this.source);
            }
            this.eventReceiver.trigger('player:enabled');
        },
        _deactivate: function() {
            var that = this;
            if (this.active) {
                that.container.removeClass('active');
                that.element.removeClass('active');
            }
            this.active = false;
            this.resetVideo();
        },
        resetVideo: function(){
            if (this.player) {
                this.player.stopVideo();
            }
            return this;
        },
        _showWarning: function(){
            /*jshint multistr: true */
            var that    = this,
                warning =   '<div class="explicit-video-overlay">\
                                <div class="content-container">\
                                    <p class="title">Warning!</p>\
                                    <p class="description">This video contains images of graphic violence.</p>\
                                    <button class="dismiss-explicit">Click To View</button>\
                                </div>\
                            </div>';
            $(warning).insertBefore(this.element);
            this.element.parent().find('.dismiss-explicit').bind('click', function(){
                that._removeWarning();
            });
        },
        _removeWarning: function(){
            var overlay = this.container.find('.explicit-video-overlay');
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