$(function() {

    "use strict";

    var __window    = $(window),
        __body      = $(document.body);

    var isDesktop = function() {
        return __window.innerWidth > 768;
    };

    var scrollableArea      = $('.about-scroller'),
        mainSidebarToggle   = $('.tab-controller'),
        subNav              = $('.subnav'),
        subNavMenu          = subNav.find('.inner-subnav .menu'),
        subNavAnchors       = subNavMenu.find('a'),
        sections            = $('#intro, #what-we-do, #how-it-works, #press, #video-gallery');

    // move out of the scrollable area
    subNav.insertBefore( '.main-container--inner' );
    $('.tweets-sidebar, .widget-modal').insertBefore( '.main-container--inner' );

    new SidebarToggler({
        showSidebar : isDesktop(),
        showToggler : false,
        showTooltip : false,
        togglerHiddenOnLargeView : true
    });

    // spy scrolling
    if ( window.hasTouch() === false ) {
        var scrollTimer;
        scrollableArea.bind('scroll', function Scrolling () {
            if ( scrollTimer ) clearTimeout( scrollTimer );

            scrollTimer = setTimeout(function() {
                var onViewport = $.grep(sections, function(n) {
                    var viewportTop     = scrollableArea[0].offsetTop,
                        viewportHeight  = __body.height() - viewportTop,
                        itemTop         = $(n).offset().top;
                    return itemTop < viewportHeight && itemTop > viewportTop;
                });

                if ( typeof onViewport[0] === "object" ) {
                    subNavAnchors.removeClass('active');
                    $( '[data-target="' + onViewport[0].id + '"]' ).addClass('active');
                }
            }, 250);

            return false;
        });
    }

    // subnavigation smooth scrolling
    subNavAnchors.bind('click', function subNavAnchorsClick () {
        var section = document.getElementById( this.getAttribute('data-target') );
        scrollableArea.animate({
            scrollTop : section.offsetTop + 20
        }, 1000);

        subNavAnchors.removeClass('active');
        this.className += " active";

        return false;
    });


    // subscribe mewsletter
    var opener              = $('.open-modal-subscribe'),
        modal_subscribe     = $('.widget-modal'),
        form_subscribe      = $('#form_subscribe'),
        input_subscribe     = form_subscribe.find('.subscribe'),
        submit_subscribe    = form_subscribe.find('[type="submit"]'),
        feedback            = form_subscribe.find('.response');

    opener.bind('click', function(e){
        e.preventDefault();
        modal_subscribe.show();
        input_subscribe.removeClass('success error').val('');
        feedback.removeClass('success error').html('');
    });
    modal_subscribe.find('.modal-header .close').bind('click', function(e) {
        e.preventDefault();
        modal_subscribe.hide();
    });

    form_subscribe
        .bind('submit', function(e) {
            e.preventDefault();
            var exp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if ( exp.test(input_subscribe.val()) ) {
                return true;
            } else {
                input_subscribe.removeClass('success').addClass('error').focus();
                feedback.removeClass('success').addClass('error').html("Invalid Email");
                return false;
            }
        })
        .bind('ajax:beforeSend', function() {
            // sending
            input_subscribe.attr('disabled', true);
            submit_subscribe.attr('disabled', true);
            feedback.removeClass('success error').html('Subscribing...');
        })
        .bind('ajax:complete', function() {
            // send
            input_subscribe.attr('disabled', false);
            submit_subscribe.attr('disabled', false);
        })
        .bind('ajax:success', function(xhr, data, status) {
            if (data.created === false && data.error) {
                // already subscribed
                input_subscribe.removeClass('success').addClass('error').focus();
                feedback.removeClass('success').addClass('error').html("Email is already subscribed");
                return;
            }

            if (data.created === true) {
                // added
                // input_subscribe.removeClass('error').addClass('success');
                // feedback.removeClass('error').addClass('success').html('Subscribed - look for the confirmation email!');
                window.location = window.location.pathname + '?tnx=Subscribed - look for the confirmation email!';
            }
        })
        .bind('ajax:error', function(e) {
            input_subscribe.removeClass('success').addClass('error').focus();
            feedback.removeClass('success').addClass('error').html("Error performing request");
            console.log(e);
        });


    // tabs
    $('.widget-tab-pane').hide();
    $('.widget-tabs-nav .tab').bind('click', function(e) {
        e.preventDefault();

        var self    = $(this),
            wrapper = self.closest('.widget-tabs'),
            target  = $( self.data('target') );

        wrapper.find('> .widget-tabs-content > .widget-tab-pane').hide();
        wrapper.find('.widget-tabs-nav').first().find('li').removeClass('active');
        self.parent('li').addClass('active');
        target.show();
    });

    $('.widget-tabs').each(function(i, el) {
        $(el).find('.tab').first().click();
    });


    // press
    $('.widget-scroller').each(function(i, el) {
        var scroller    = $(this),
            prev        = scroller.find('.prev'),
            next        = scroller.find('.next'),
            wrapper     = scroller.find('.widget-scroller-items-wrapper'),
            items       = wrapper.find('.widget-scroller-items'),
            item_width  = items.find('li').eq(0).outerWidth(true),
            view_width  = scroller.find('.widget-scroller-viewport').width(),
            init_pos    = 0,
            items_width = 0;

        items.find('li').each(function() {
            items_width += parseInt($(this).outerWidth(true), 10);
        });

        var max_left_pos = (items_width - view_width);
        wrapper.width( items_width );

        if ( items_width <= view_width ) {
            prev.addClass('disabled');
            next.addClass('disabled');
        } else {
            prev.bind('click', function() {
                if ( init_pos < 0 ) {
                    init_pos += item_width;
                    wrapper.css('margin-left', init_pos);
                }
            });
            next.bind('click', function() {
                if ( (init_pos * -1) < max_left_pos ) {
                    init_pos -= item_width;
                    wrapper.css('margin-left', init_pos);
                }
            });
        }
    });


    // Video Gallery
    var videoGallery = $('.video-gallery');

    videoGallery.find('.widget-tabs-nav .tab').bind('click', function(e) {
        var self    = $(this),
            wrapper = self.closest('.widget-tabs'),
            target  = $( self.data('target') ),
            iframe  = target.find('iframe');

        var params  = "?rel=0&autoplay=1"; //(e.originalEvent !== undefined) ? "?rel=0&autoplay=1" : "?rel=0";
        var videoUrl= self.data('video-url') + params;

        if ( window.innerWidth > 768 )
            wrapper.find('> .widget-tabs-content > .widget-tab-pane').find('iframe').attr('src', "");

        if ( iframe.length ) {
            iframe.attr('src', videoUrl);
        } else {
            var video = $('<iframe/>', {
                'width': 670,
                'height': 408,
                'src': videoUrl,
                'frameborder': 0,
                'allowfullscreen': true
            });
            target.find('.video-holder').append( video );
        }
    });
    // trigger click with placeholder too
    videoGallery.find('.video-holder img').bind('click', function() {
        var id = $(this).closest('.widget-tab-pane')[0].id;
        videoGallery.find('.tab[data-target="#' + id + '"]').trigger('click');
        return false;
    });

    // tweets sidebar
    var tweetsSidebar       = $('.tweets-sidebar'),
        tweetsSidebarOpener = $('.tweets-button-container button'),
        tweetsSidebarCloser = tweetsSidebar.find('.close'),
        mainContainerHeight;
    /*
        Tweets sidebar features hacks in order to fix the scrolling
        due safari on ios < 5.0.1 not allowing to scroll on divs,
        thus overflows are explicitly provided and elements repaint
        are forced, handle with care.
    */
    tweetsSidebarOpener.bind('click', function(e) {
        tweetsSidebar.toggleClass('open')
            .fadeIn()
            .css({
                'overflow-y':'scroll',
                'overflow-x':'hidden',
                'scrollTop':'0'
            });
        scrollableArea.css({
                'overflow-y':'hidden',
                'overflow-x':'hidden'
            })
            .attr('data-scroll-pos-y', scrollableArea.scrollTop());
        if (window.innerWidth <= 768) {
            mainSidebarToggle.css('visibility','hidden');
        }
        return false;
    });

    tweetsSidebarCloser.bind('click', function(e) {
        var scrollTarget = scrollableArea.attr('data-scroll-pos-y');
        mainSidebarToggle.css('visibility','');
        tweetsSidebar.toggleClass('open')
            .fadeOut()
            .css({
                'overflow-y':'hidden',
                'overflow-x':'hidden'
            });
        scrollableArea.hide()
            .show(0)
            .css({'overflow-y':'scroll'})
            .scrollTop(scrollTarget);
        scrollableArea[0].style.webkitTansform = 'scale(1)';
        return false;
    });


    /* Social Media Buttons */
    // var connect = document.querySelector('.connect');
    // new SocialMediaButtons({
    //     facebookLikeButton : {
    //         element: connect.querySelector('.js-fb-like')
    //     },
    //     twitterTweetButton : {
    //         element: connect.querySelector('.js-tw-tweet')
    //     },
    //     twitterFollow : {
    //         element: connect.querySelector('.js-tw-follow'),
    //         showCount: true,
    //         showScreenName: false
    //     }
    // });

    DynamicMeasures.update();


});
