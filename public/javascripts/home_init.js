$(function () {

    "use strict";

    document.body.classList.add('view__homepage');

    var isDesktop = function() {
        return window.innerWidth > 768;
    };

    new SidebarToggler({
        showSidebar : isDesktop(),
        showToggler : false,
        showTooltip : false,
        togglerHiddenOnLargeView : true
    });

    // Cover Boxes
    var boxes           = document.querySelectorAll('.home-cover__content'),
        infographics    = document.querySelectorAll('.home-cover--infographic .home-cover__box');

    // Notifications
    var aboutLinkWrapper    = $('.about-link-wrapper'),
        aboutTooltip        = aboutLinkWrapper.find('.tooltip'),
        notificationBar     = $('.notification-bar'),
        notificationsClose  = notificationBar.find('.notification .close-message'),
        welcome             = $('.welcome'),
        welcomeClose        = welcome.find('.close-message');

    /* BOXES */
    // Draw the infographics on boxes
    [].slice.call(infographics, 0).forEach(function( e, i ) {
        var data  = JSON.parse( e.getAttribute('data-json') ),
            el, chart;
        if ( data.chartData !== undefined ) {
          el = e.querySelector('.home-cover__box-infographic');
          chart = new InfoChart( el, data, true ).chartInstance;
        }
    });

    // Bind click event to each box
    [].slice.call(boxes, 0).forEach(function( e, i ) {
        e.addEventListener('click', function(event) {
            if ( event.target.nodeName !== "A" ) {
                var url = this.getAttribute('data-url');
                window.location = url;
                return false;
            }
        });
    });

    /* Notifications */
    var checkNotifications = function checkNotifications() {
        if ( !notificationBar[0].children.length ) {
            notificationBar[0].className += ' is-empty';

            aboutTooltip.show();
            aboutLinkWrapper.one('mouseenter', function() {
                aboutTooltip[0].setAttribute('style', '');
            });
        }
        return this;
    };

    checkNotifications();

    notificationsClose.bind('click', function(e) {
        var noty = $( e.target ).parent();
        noty.fadeOut(400, function() {
            noty.remove();
            checkNotifications();
        });
    });

    welcomeClose.bind('click', function () {
        welcome.fadeOut(400, function() {
            welcome.remove();
            checkNotifications();
        });
    });

    /* Social Media Buttons */
    // var connect = document.querySelector('.notification-bar .actions');
    // new SocialMediaButtons({
    //     facebookLikeButton : {
    //         element: connect.querySelector('.facebook-like')
    //     },
    //     twitterTweetButton : {
    //         element: connect.querySelector('.tweet')
    //     },
    //     twitterFollow : {
    //         element: connect.querySelector('.twitter-follow'),
    //         showCount: false,
    //         showScreenName: true
    //     }
    // });

    DynamicMeasures.update();

});
