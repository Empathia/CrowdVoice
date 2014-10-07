$(function () {

    var voice_loaded    = false,
        votes           = new Votes('.vote-post'),
        overlays        = new Overlay('.voice-box'),
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
        isotopeReady    = false,
        sidebarToggler, relayoutTimeout, backgroundTimeout, wallSizeTimeout;

    // Move tweets sidebar
    tweetsSidebar.insertBefore( '.main-container--inner' );

    // check if it's a mobile device so we don't unnnecessarily instanciate the post interface and the infosidebar
    if (!isDevice) {
        //instanciate infosidebar
        //check for infobox sidebar, in case the sidebar is present, no description for the voice is needed
        if(infoSidebar.length){
            new InfoSidebar('.info-sidebar', infoboxData);
        }

        new Post('.post', {
            tooltipImage: new Tooltip('.tool-image'),
            tooltipVideo: new Tooltip('.tool-video'),
            tooltipLink : new Tooltip('.tool-link'),
            carousel    : new Carousel(),
            postFilter  : postFilter,
            votes       : votes,
            overlays    : overlays
        });

        new Tooltip('.public');
        new Tooltip('.mod');
        new Tooltip('.widget');
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

    new Message('.flash-message');
    new FacebookNavButton({
        fbPath : _fbPath
      });

    if ( $.deparam.querystring().post ) {
        var link = $('.source-url.post-' + $.deparam.querystring().post);
        if ( link.length ) {
            overlays.buildOverlay( link );
        }
    }

    if ( !$.isEmptyObject( window.timeline_dates ) ){
        Timeline.build($('.timeliner-group'), {
            dates   : window.timeline_dates,
            overlays: overlays,
            votes   : votes
        });
    }

    DynamicMeasures.setTopFaces();

    /* ---------------- FUNCTIONS ------------------ */
    var resizePostWall = function(){
        var sidebarWidth        = infoSidebar.hasClass('closed') || $(this).width() <= 1024 ? 0 : infoSidebar.outerWidth(true),
            // tweetsWidth     = TweetsSidebar.element.outerWidth(true) + parseInt(TweetsSidebar.element.css('right'), 10),
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
                        isotope_init();
                        voice_loaded = true;
                    }
                });
                // fallback in case images fail
                setTimeout(function() {
                    if (!voice_loaded){
                        isotope_init();
                    }
                }, 5000);
            } ).attr('src', loader.data('background-loading-image'));
        } else {
            isotope_init();
        }

        if (voiceBox.length === 0){
            $('.updating-wrapper').hide();
        }
    };

    var isotope_init = function (){
        // REMOVED BY CLIENT REQUEST UNCOMMENT TO RE-APPLY THE GAPLESS ALGORITHM:
        // colWidth = setPostMeasures();
        //remove all thumbnail pictures from posts
        voicesContainer.find('[src*="thumb_link-default.png"]').hide();
        voicesContainer.isotope({
            animationEngine: $.browser.mozilla || $.browser.msie ? 'jquery' : 'best-available',
            resizable: false,
            itemSelector: '.voice-box',
            masonry: {
                columnWidth: colW - 5
            },
            callback: function(){
                $('.updating-wrapper').hide();
                $('body').css('overflow', 'hidden');
                voiceWrapper.removeClass('initial-state');
                DynamicMeasures.update();
                // re-trigger resize to help slow devices on proper arrangement
                setTimeout(function(){win.smartresize();}, 500);
            }
        });
        isotopeReady = true;
    };

    // isotope_init = function() {
    //     $('.updating-wrapper').hide();
    //     $('body').css('overflow', 'hidden');
    //     voiceWrapper.removeClass('initial-state');
    //     DynamicMeasures.update();
    //     // re-trigger resize to help slow devices on proper arrangement
    //     setTimeout(function(){win.smartresize();}, 500);
    // }


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

        tweetsSidebar.bind('tweets.change', function(){
            resizePostWall();
        });

        $('.voice-subtitle').bind('excerpt.toggle', function () {
            DynamicMeasures.setTopFaces();
            TweetsSidebar.updatePosition();
        });
    };

    var load_votes = function() {
        if ( posts_votes !== null ) {
            $.each(posts_votes, function(i, val) {
                var ele = $(".voice-box[data-post-id='"+val.id+"']");
                ele.find('a.source-url').attr('data-voted', true);
                ele.find('.voice-unmoderated .flag-div .vote-post').toggleClass('flag flag-pressed');
                if (val.positive) {
                    ele.find('.voice-unmoderated li.up').addClass('up_hover');
                    ele.find('.voice-unmoderated li.down').remove();
                } else {
                    var url = ele.find('.voice-action .flag-div .vote-post').attr('href').split('?');
                    ele.find('.voice-action .flag-div .vote-post').attr('href', [url[0], 'rating=1'].join('?'));
                    ele.find('.voice-action .flag-div .vote-post').toggleClass('flag flag-pressed');
                    ele.find('.voice-unmoderated li.down').addClass('down_hover');
                    ele.find('.voice-unmoderated li.up').remove();
                    ele.find('.voice-action .flag-div .flag-tooltip span').addClass('flagged').html('Unflag Content');
                }
            });
        }
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
        if (isotopeReady) {
            setTimeout(function(){
                voicesContainer.isotope('reLayout');
            }, 500);
        }
    };
    /* INITS */
    background_loader_init();
    load_votes();
    setBackgroundSize();
    setPostWallSize();
    setNavigationBehaviors();
    bindEvents();

    DynamicMeasures.update();
    DynamicMeasures.setTopFaces();
});
