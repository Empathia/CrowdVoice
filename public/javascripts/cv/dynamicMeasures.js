Class('DynamicMeasures')({

    sidebarScroll   : $('.sidebar-scroller'),
    mainContent     : $('.main-container--inner'),
    headerSeparation: $('.header-sep'),
    logoHolder  : $('hgroup'),
    loginForms  : $('.create-voice'),
    search      : $('.voice-search'),
    header      : $('header'),
    fixedFake   : $('.fixed-fake'),
    win         : $(window),

    update : function () {
        var that    = this,
            wh      = this.win.height(),
            headerHeight = this.header.outerHeight(true),
            fixedElementsHeight = 0;

        var getScrollerHeight = function getScrollerHeight () {
            var logoHeight  = that.logoHolder.outerHeight(true),
                loginHeight = that.loginForms.is(':visible') ? that.loginForms.outerHeight(true) : 0,
                seachHeight = that.search.outerHeight(true);
            return (wh - (logoHeight + loginHeight + seachHeight));
        };

        if ( this.fixedFake.length ) {
            this.fixedFake.each(function(i, e) {
                var el = $(this);
                fixedElementsHeight += el.is(':visible') && el.height() || 0;
            });
        }

        this.mainContent.height( wh - fixedElementsHeight );
        this.sidebarScroll.height( getScrollerHeight() );
        this.headerSeparation.css('margin-top', headerHeight );

        return this;
    },

    setTopFaces : function () {
        this.headerSeparation.css('margin-top', this.header.height());
        return this;
    }
});
