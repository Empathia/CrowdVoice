$(function () {

    "use strict";

    var __window    = $(window),
        __body      = $(window.body);

    new SidebarToggler({
        showSidebar: true,
        showToggler: false,
        showTooltip : false,
        togglerHiddenOnLargeView: true
    });

    // Tickers
    var tickers = document.querySelectorAll('ul.news-ticker');

    // Home Columns
    //get all data for controlled image loading
    var columnsContainer    = $('.home-columns'),
        $homeImages         = columnsContainer.find('.voice-list img'),
        homeImagesQty       = $homeImages.length,
        homeLoadedImages    = 0,
        notificationBar     = $('.notification-bar'),
        notificationsClose  = notificationBar.find('.notification .close-message'),
        $voicesTooltipTemplate = $('.voice-count-tooltip').show();

    /* Tickers */
    [].slice.call(tickers, 0).forEach(function( el, i ) {
        if ( el.childElementCount ) {
            $(el).liScroll({
                travelocity: 0.05
            });
        }
    });

    var resizeColumns = function() {
        columnsContainer.children().each(function() {
            $(this).width(Math.floor(columnsContainer.width() / 3 - 15));
        });
    };

    var initHomeColumns = function(){
        $homeImages.each(function() {
            var imgWidth = $(this).width(),
                imgHeight = $(this).height(),
                aspectRatio = imgWidth / imgHeight,
                parentWidth = $(this).parent().width();
        });

        $(window).resize();
    };

    var reportLoad = function(){
      homeLoadedImages++;
      //init the grid only after all images report they are loaded
      if(homeLoadedImages === homeImagesQty){
        initHomeColumns();
      }
    };

    /* Notifications */
    var checkNotifications = function checkNotifications() {
        if ( !notificationBar[0].children.length ) {
            notificationBar[0].className += ' is-empty';
        }
        return this;
    };

    //create new images to correctly trigger the load event
    $homeImages.each(function(){
        var $orig = $(this);
        var $newImage = $('<img />');

        $orig.replaceWith($newImage);

        $newImage.load( function(){
            reportLoad();
        }).error(function(){
            reportLoad();
        }).attr('src', $orig.attr('src')).attr('alt', $orig.attr('alt'));
    });

    // Voice's Tooltips
    $('.voices-count').bind({
        mouseover: function() {
            var $this           = $(this),
                elementOffset   = $this.offset(),
                data            = eval( $this.find('.vTooltip').data('counts') ),
                toolTipWidth, toolTipHeight;

            $voicesTooltipTemplate.show();
            $voicesTooltipTemplate.find('.photo-count').next('span').text( data.image );
            $voicesTooltipTemplate.find('.video-count').next('span').text( data.video );
            $voicesTooltipTemplate.find('.link-count').next('span').text( data.link );

            toolTipWidth  = $voicesTooltipTemplate.children().width();
            toolTipHeight = $voicesTooltipTemplate.height();

            $voicesTooltipTemplate.css({
                'width' : $voicesTooltipTemplate.children().width() + 8,
                'left'  : (elementOffset.left - toolTipWidth + 20) + 'px',
                'top'   : (elementOffset.top - toolTipHeight - 10) + 'px'
            });
        },
        mouseout: function() {
            $voicesTooltipTemplate
                .attr('style', '')
                .hide();
        }
    });

    __window.resize(function() {
        $homeImages.each(function() {
            var imgWidth = $(this).width(),
                imgHeight = $(this).height(),
                aspectRatio = imgWidth / imgHeight,
                parentWidth = $(this).parent().width();
        });
        resizeColumns();
    });

    notificationsClose.bind('click', function(e) {
        var noty = $( e.target ).parent();
        noty.fadeOut(400, function() {
            noty.remove();
            checkNotifications();
        });
    });

    DynamicMeasures.update();

});
