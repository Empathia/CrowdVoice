Class('SidebarToggler')({
    prototype: {

        init: function(options) {
            this.options = {
                showSidebar : true,
                showToggler : true,
                showTooltip : true,
                togglerHiddenOnLargeView: false
            };
            $.extend(this.options, options);

            this.win                        = $(window);
            this.body                       = $(document.body);
            this.element                    = $('.sidebar-wrapper');
            this.toggler                    = $('.tab-controller');
            this.mainContent                = $('.main-container');
            this.mainContentDisableOverlay  = $('.main-container--disable-overlay');
            this.scroller                   = this.element.find('.sidebar-scroller');
            this.classStates = {
                opened: 'sidebar-state__open'
            };



            this._checkOptions();
            this._bindEvents();
        },

        _checkOptions : function() {
            // regardless the passed option, if screen width is lower than 768 don't display the tooltip
            if ( window.isDevice || this.win[0].innerWidth <= 768 ) {
                this.options.showTooltip = false;
            }
            this.options.showSidebar ? this.show() : this.hide();
            if ( this.options.showToggler ) this.toggler.hide().show();
            if ( this.options.showTooltip ) this.showSidebarTooltip();
            if ( this.options.togglerHiddenOnLargeView ) this.toggler.addClass('hidden-on-large-view');
        },

        _bindEvents: function () {
            var that = this,
                resizeTimer = null;

            this.toggler.bind('click', function (ev) {
                that.toggle();
            });
            this.toggler.bind('sidebar:toggle', function(ev){
                that.toggle();
            });
            this.toggler.bind('sidebar:hide', function(ev){
                return that.open && that.hide();
            });

            this.mainContent.bind('click', function(ev) {
                if (window.innerWidth <= 768 && that.open) {
                    that.hide();
                    return false;
                }
                return true;
            });

            this.element.bind('sidebar.change', function(){
                that.reinitialiseScroller(true);
            });

            if (window.hasTouch()) {
                this.mainContentDisableOverlay[0].addEventListener("touchstart", function disableInteraction() {
                    return false;
                }, true);
            }

            this.win.bind('resize', function() {
                if (resizeTimer) clearTimeout(resizeTimer);
                resizeTimer = setTimeout(function() {
                    if (window.isDevice) {
                        if (window.innerWidth <= 768 && that.open) this.hide();
                    }
                    that.initializeScroller();
                    clearTimeout(resizeTimer);
                }, 500);
            }).ready(function(){
                !isDevice && that.initializeScroller();
            });

            // sidebar transition end
            if ( transitionEnd  !== undefined ) {
                this.element.bind(transitionEnd, function(ev) {
                    if ('smartresize' in that.win) that.win.smartresize();
                    that.element.trigger('sidebar.toggle');
                    return this;
                });
            }

            return this;
        },

        toggle : function () {
            return this.open ? this.hide() : this.show();
        },

        show : function () {
            this.body.addClass( this.classStates.opened );
            this.open = true;
            this.toggler.removeClass('close-control');
            this.reinitialiseScroller();
            if (transitionEnd === undefined) {
                this.element.trigger('sidebar.toggle');
                if ('smartresize' in this.win) {
                    this.win.smartresize();
                }
            }
        },

        hide : function () {
            this.body.removeClass( this.classStates.opened );
            this.open = false;
            this.toggler.addClass('close-control');
            this.reinitialiseScroller();
            if (transitionEnd === undefined) {
                this.element.trigger('sidebar.toggle');
                if ('smartresize' in this.win) {
                    this.win.smartresize();
                }
            }
        },

        showSidebarTooltip: function() {
            var that      = this,
                tooltip   = $('<div class="sidebar-tooltip">'),
                dismissTimeout;

            tooltip.css('opacity',0)
                .appendTo(this.toggler)
                .text('Click here to see more.')
                .animate({opacity:1}, 500);

            dismissTimeout = setTimeout(function() {
                that.toggler.find('.sidebar-tooltip').animate({
                    opacity: 0
                }, 300, function() {
                    that.toggler.find('.sidebar-tooltip').remove();
                });
            }, 5000);
        },
        initializeScroller: function(){
            this.scrollerData = this.element.find('.sidebar-scroller')
                                        .jScrollPane({autoreinitialise:false})
                                        .data('jsp');
        },
        reinitialiseScroller: function(delayed){
            var that = this,
                delay = delayed ? 300 : 0;
            if (this.reinitialiseTimeout) {
                clearTimeout(this.reinitialiseTimeout);
            }
            setTimeout(function(){
                that.scrollerData && that.scrollerData.reinitialise();
            }, delay);
        }
    }
});
