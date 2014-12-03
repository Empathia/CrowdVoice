Class('DynamicMeasures')({

    sidebarScroll   : $('.sidebar-scroller'),
    mainContent     : $('.main-container--inner'),
    // headerSeparation: $('.header-sep'),
    logoHolder  : $('hgroup'),
    loginForms  : $('.create-voice'),
    search      : $('.voice-search'),
    header      : $('header'),
    fixedFake   : $('.fixed-fake'),
    win         : $(window),

    update : function () {
        var dynamicMeasures, wh, headerHeight, fixedElementsHeight, getScrollerHeight;

        dynamicMeasures = this;
        wh = this.win.height();
        headerHeight = this.header.outerHeight(true);
        fixedElementsHeight = 0;

        getScrollerHeight = function getScrollerHeight () {
            var logoHeight, logoHeight, searchHeight;

            logoHeight  = dynamicMeasures.logoHolder.outerHeight(true);
            searchHeight = dynamicMeasures.search.outerHeight(true);
            
            if (dynamicMeasures.loginForms.is(':visible')) {
                loginHeight = dynamicMeasures.loginForms.outerHeight(true);
            } else {
                loginHeight = 0;
            }

            return (wh - (logoHeight + loginHeight + searchHeight));
        };

        if (this.fixedFake.length) {
            this.fixedFake.each(function(i, e) {
                var el = $(this);
                fixedElementsHeight += el.is(':visible') && el.height() || 0;
            });
        }

        this.mainContent.height(wh - fixedElementsHeight);
        this.sidebarScroll.height( getScrollerHeight() );
        //this.headerSeparation.css('margin-top', headerHeight );

        return this;
    },
    /*
    setTopFaces : function () {
        this.headerSeparation.css('margin-top', this.header.height());
        return this;
    }*/
});
