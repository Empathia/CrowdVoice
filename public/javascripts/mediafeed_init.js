$(function () {

    var voice_loaded    = false,
        gazaOverlay     = new VideoOverlay('.view-video li'),
        postFilter      = new Filters('.filters', '.voice-box'),
        voicesSidebarControl    = $('.tab-controller'),
        win             = $(window),
        voiceWrapper    = $('.voice-wrapper'),
        $sweeper        = $('.voice-wrapper .sweeper'),
        voicesContainer = $('.voices-container'),
        voiceScroller   = $('.voices-scroller'),
        tweetsSidebar   = $('.tweets-sidebar'),
        timeline        = $('.timeliner-group'),
        infoSidebar     = $('.info-sidebar'),
        colW            = 200,
        columns         = null,
        TweetsSidebar   = new ToggleTweets('.tweets-sidebar', { hidden : true, specialClass: 'media_feed' }),
        sidebarDisplay  = true,
        sidebarToggler, relayoutTimeout, backgroundTimeout, wallSizeTimeout;

    window.isotopeReady = false;

    var _mapCreated, $mapWrapper, lat, lng, voiceMapWidget, $mapLink;

    _mapCreated = false;
    $mapWrapper = $('.mediafeed-map-wrapper');
    lat = $mapWrapper.data('lat');
    lng = $mapWrapper.data('lng');
    voiceMapWidget = new CV.Map({zoom : 8}).render($mapWrapper);
    $mapLink = $(document.querySelector('.info-tool-link.map'));

   window.addCoordsToMap = function addCoordsToMap() {
        _mapCreated = true;
        voiceMapWidget.setMapCenter(lat, lng).createMap();
    } 

    $mapLink.bind('click', function(){
        $mapWrapper[0].classList.toggle('active');

        if (voiceMapWidget.active) voiceMapWidget.deactivate();
        else voiceMapWidget.activate();

        if (CV.Map.isGoogleScriptInyected === false) {
            CV.Map.inyectGoogleMapsScript("addCoordsToMap");
        } else if (_mapCreated === false) {
            addCoordsToMap();
        }

        return false;
    }); 

    // Move tweets sidebar
    tweetsSidebar.insertBefore( '.main-container--inner' );

    new CV.Tooltip({
        element : $('.voice-description-tooltip'),
    });

    new CV.Tooltip({
        element: $('.embeddable-widget-tooltip')
    });

    // check if it's a mobile device so we don't unnnecessarily instanciate the post interface and the infosidebar
    if (!isDevice) {
        //instanciate infosidebar
        //check for infobox sidebar, in case the sidebar is present, no description for the voice is needed
        if(infoSidebar.length){
            new InfoSidebar('.info-sidebar', infoboxData);
        }

        new Post({
            element : $('.post'),
            postFilter : postFilter
        });

        new CV.Tooltip({
            text : 'Go back to public mode',
            className : 'public-mode-tooltip',
            nowrap : true
        }).render($('.public'));

        new CV.Tooltip({
            className : 'moderator-mode-tooltip',
            html : '\
                <p class="title">Participate!</p>\
                <p class="description">\
                  Help us approve images, videos and external links. Deny any content that you feel should NOT be posted here.\
                </p>\
            '
        }).render($('.mod'));

        new BlogWidget();
    }

    //check for infobox Tags data
    if(infoboxTags.length > 0){
        new InfoTagsTooltip('.tags-container');
    } else {
        $('.tags-container').hide();
    }

    // The requirement is as follows:
    // if there's an infosidebar, don't display the main sidebar
    // if there's no infosidebar, display sidebar by default
    // regardless, if screen width is lower than 768, don't display the main sidebar
    if (window.innerWidth <= 768 || typeof infoboxData !== 'undefined' && infoboxData.length) {
        sidebarDisplay = false;
    }

    sidebarToggler =    new SidebarToggler({
                            showSidebar : sidebarDisplay,
                            showToggler : true,
                            showTooltip : !sidebarDisplay
                        });

    new CV.FlashMessage({
        element : $('.flash-message')
    });

    new FacebookNavButton({
        fbPath : _fbPath
      });

    if ( !$.isEmptyObject( window.timeline_dates ) ){
        CV.timeline = new Timeline();

        CV.timeline.build($('.timeliner-group'), {
            dates   : window.timeline_dates
        });
    }

    // DynamicMeasures.setTopFaces();

    /* ---------------- FUNCTIONS ------------------ */
    var resizePostWall = function(){
        var sidebarWidth        = infoSidebar.hasClass('closed') || $(window).width() <= 1024 ? 0 : infoSidebar.outerWidth(true),
            timelineSpace       = window.innerWidth <= 768 ? 0 : 40,
            tweetsSidebarWidth  = window.innerWidth <= 768 ? 0 : (tweetsSidebar.hasClass('open') ? tweetsSidebar.width() : 0),
            wrapperSpace        = $sweeper.width() - timelineSpace - sidebarWidth - tweetsSidebarWidth,
            currentColumns      = Math.floor((wrapperSpace) / colW),
            containerWidth;
        if (currentColumns !== columns) {
            columns = currentColumns;
            containerWidth = columns * colW;
            voicesContainer.css('width', containerWidth);
        }

        if (sidebarWidth === 0) {
            voiceScroller.removeClass('with-infosidebar');
        }

        setPostWallSize();
    };

    var background_loader_init = function(){
        var loader = $('.updating-wrapper'),
            voiceBox = $('.voice-box'),
            boxCounter = 0;

        loader.parent().css({
            position: 'relative'
        });

        if ( loader.data('background-loading-image') ){
            $('<img/>').bind('load error', function(){

                voiceBox.find('img').imagesLoaded(function (e) {
                    boxCounter++;
                    if(boxCounter == voiceBox.length){
                        // isotope_init();
                        voice_loaded = true;
                    }
                });
                // fallback in case images fail
                setTimeout(function() {
                    if (!voice_loaded){
                        // isotope_init();
                    }
                }, 5000);
            } ).attr('src', loader.data('background-loading-image'));
        } else {
            // isotope_init();
        }

        if (voiceBox.length === 0){
            $('.updating-wrapper').hide();
        }
    };


    var bindEvents = function (){
        var infoSidebarTabController    = $('.info-tab-controller'),
            voiceSidebarTabController   = $('.tab-controller');

        infoSidebarTabController.bind('click', function(){
            voiceSidebarTabController.trigger('sidebar:hide');
        });

        voiceSidebarTabController.bind('click', function(){
            infoSidebarTabController.trigger('infoSidebar.hide');
        });

        win.bind('ready resize smartresize', function(){
            resizePostWall();
            setNavigationBehaviors();
            setBackgroundSize();
        }).smartresize();

        // $(window).bind('ready resize smartresize', function() {
        //     resizePostWall();
        //     setNavigationBehaviors();
        //     setBackgroundSize();
        //     // CV.voicesContainer.delayedEvent.dispatch('resize', {fn : resizePostWall});
        // });

        var $win = $(window);
        $win.smartresize();

        tweetsSidebar.bind('tweets.change', function(){
            resizePostWall();
        });
    };

    var setBackgroundSize = function() {
        var ghostImg        = $(document.createElement('img')),
            bgReceiver      = $('.updating-wrapper'),
            // wrapperHeight   = win.height() - $('header').height(),
            wrapperHeight   = bgReceiver.height(),
            bgSrc           = bgReceiver.css('background-image'),
            bgUrl           = /^url\((['"]?)(.*)\1\)$/.exec(bgSrc),
            bgPath          = bgUrl ? bgUrl[2] : "",
            bgSize;
        if (bgReceiver.css('display') === 'block') {
            ghostImg.css({
                'opacity':'0',
                'position':'absolute',
                'width':'100%'
            }).appendTo(bgReceiver).attr('src', bgPath);
            if (ghostImg.height() > 0) {
                bgSize = ghostImg.height() < wrapperHeight ? 'auto 100%' : '100% auto';
                // bgReceiver.css('backgroundSize','auto 100%');
                bgReceiver.css('backgroundSize',bgSize);
            } else {
                if (backgroundTimeout != undefined) {
                    clearTimeout(backgroundTimeout);
                }
                backgroundTimeout = setTimeout(function(){
                    setBackgroundSize();
                }, 100);
            }
            ghostImg.remove();
        }
    };

    var setNavigationBehaviors = function(){
        var navBar, mainContainer, voiceTitle, filtersBar, postBar, currentParent, detachTimeout;
            if (detachTimeout) {
                clearTimeout(detachTimeout);
            }
            detachTimeout = setTimeout(function(){
                navBar          = $('.nav-bar'),
                mainContainer   = $('.main-container'),
                voiceTitle      = mainContainer.find('.voice-title'),
                filtersBar      = mainContainer.find('.filters-and-mode'),
                tagsContainer   = filtersBar.find('.tags-container'),
                tagsModal       = $('.info-tags__tooltip'),
                postBar         = mainContainer.find('.post-and-actions'),
                currentParent   = navBar.parent();

                if (window.innerWidth <= 480 && !navBar.hasClass('detached')) {
                    navBar.addClass('detached').insertBefore(mainContainer);
                    filtersBar.addClass('detached');
                    mainContainer.append(filtersBar, tagsModal);
                } else if (window.innerWidth > 480 && navBar.hasClass('detached')) {
                    navBar.insertBefore(voiceTitle).removeClass('detached');
                    tagsContainer.append(tagsModal);
                    filtersBar.insertAfter(postBar);
                }

                if (window.innerWidth <= 1024) {
                    voiceScroller.append(timeline);
                } else {
                    voiceScroller.after(timeline);
                }

                clearTimeout(detachTimeout);
            }, 100);
    };

    var setPostWallSize = function() {
        var windowWidth             = window.innerWidth,
            voiceSidebarWidth       = windowWidth <= 768 ? 0 : voicesSidebarControl.offset().left + voicesSidebarControl.width(),
            tweetsSidebarWidth      = windowWidth <= 768 ? 0 : (tweetsSidebar.hasClass('open') ? tweetsSidebar.width() : 0),
            infoSidebarWidth        = infoSidebar.hasClass('closed') || windowWidth <= 1024 ? 0 : infoSidebar.width(),
            scrollerWidth           = windowWidth - voiceSidebarWidth - infoSidebarWidth - tweetsSidebarWidth - 2;
        voiceScroller.width(scrollerWidth);

        if (window.isotopeReady) {
            voicesContainer.isotope('layout');
        }

    };
    /* INITS */
    background_loader_init();

    setBackgroundSize();
    setPostWallSize();
    setNavigationBehaviors();
    bindEvents();

    DynamicMeasures.update();
    //DynamicMeasures.setTopFaces();
});
