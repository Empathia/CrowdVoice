$(function () {

    var gazaOverlay     = new VideoOverlay('.view-video li'),
        postFilter      = new Filters('.filters', '.voice-box'),
        voicesSidebarControl    = $('.tab-controller'),
        win             = $(window),
        // voiceWrapper    = $('.voice-wrapper'),
        $sweeper        = $('.voice-wrapper .sweeper'),
        voicesContainer = $('.voices-container'),
        voiceScroller   = $('.voices-scroller'),
        tweetsSidebar   = $('.tweets-sidebar'),
        timeline        = $('.timeliner-group'),
        infoSidebar     = $('.info-sidebar'),
        colW            = 200,
        columns         = null,

        sidebarDisplay  = true,
        sidebarToggler, relayoutTimeout, backgroundTimeout, wallSizeTimeout;

    window.isotopeReady = false;
    window.TweetsSidebar   = new ToggleTweets('.tweets-sidebar', { hidden : true, specialClass: 'media_feed' });
    TweetsSidebar = window.TweetsSidebar;

    // Move tweets sidebar
    tweetsSidebar.insertBefore( '.main-container--inner' );

    new CV.VoiceHeaderNav({
        element : $('.voice-info')
    });

    var twitterSearchWrapper = $('.tooltip-mediafeed-tweets');
    var twitterSearchString = twitterSearchWrapper.data('twitter-search');
    twitterSearchString = twitterSearchString.replace(/\sAND\s/, ' + ').split(/\sOR\s/).join(', ');
    new CV.Tooltip({
        html : '\
            All tweets using <span class="cv-dynamic-text-color">' + twitterSearchString + '</span>\
            will be published in this voice\'s stream!',
        position : 'bottom',
        className : 'mediafeed-tweets-tooltip'
    }).render(twitterSearchWrapper);

    new CV.Tooltip({
        element: $('.info-tags__tooltip'),
        showOnCssHover : false,
        clickHandler : function(ev) {
            if (this.active) {
                this.deactivate();
                this.toggler.removeClass('active');
            } else {
                this.activate();
                this.toggler.addClass('active');
            }

            return false
        },
        toggler : $('.tag-tooltip-trigger')
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


    CV.timeline = new Timeline({
        name : 'timeline'
    });


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
                    tagsModal.removeClass('cv-tooltip--bottom').addClass('cv-tooltip--top');
                    mainContainer.append(filtersBar);
                } else if (window.innerWidth > 480 && navBar.hasClass('detached')) {
                    navBar.insertAfter($('.description-wrapper')).removeClass('detached');
                    tagsModal.removeClass('cv-tooltip--top').addClass('cv-tooltip--bottom');
                    filtersBar.insertAfter(postBar);
                }

                if (window.innerWidth <= 1024) {
                    voiceScroller.append(CV.timeline.element);
                } else {
                    voiceScroller.after(CV.timeline.element);
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
    setPostWallSize();
    setNavigationBehaviors();
    bindEvents();

    DynamicMeasures.update();
});
