window.isDevice = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i).test(navigator.userAgent);

if (window.hasTouch()) {
    document.addEventListener("touchstart", function t(){}, true);
}

/* CSS3 transitionend function */
function whichTransitionEvent(){
    var t;
    var el = document.createElement('fakeelement');
    var transitions = {
      'transition':'transitionend',
      'OTransition':'oTransitionEnd',
      'MozTransition':'transitionend',
      'WebkitTransition':'webkitTransitionEnd'
    };

    for (t in transitions) {
        if ( el.style[t] !== undefined ) {
            return transitions[t];
        }
    }
}
/* variable to bind the transitionend event */
window.transitionEnd = whichTransitionEvent();

$(function () {
    new Accordion('.sidebar-scroller__accordion-arrow');
    new SlideSection({
        element : $('.login'),
        section : $('.login-sec')
    });
    new SlideSection({
        element : $('.install'),
        section : $('.install-sec')
    });
    new SlideSection({
        element : $('.signup'),
        section : $('.register-sec')
    });
    new LiveFilter('.voice-search > .search', '.searchable');
    new JsonForm('form.register-form', function () {
        location.reload();
    });
    new JsonForm('form.login-form', function () {
        location.reload();
    });
    new CV.Tooltip({
        text : 'Find more info about CrowdVoice here!',
        className : 'more-about-cv-tooltip',
        position : 'right'
    }).render($('.about-link-wrapper'));

    /*$('.top-left-navigation, .voice-info-tools').click(function(){
        $(this).toggleClass('active');
    });*/

    $('.searchable li a[href="'+location.pathname+'?all=true"]').parent().addClass('select');

    $('[data-action=submit]').bind("click", function () {
        $(this).closest('form').submit();
        return false;
    });

    $('.voice-search input[placeholder]').placeholder();

    /*if ($('.flash').length) {
        setTimeout(function () {
            $('.flash').hide('blind');
        }, 5000);
    }

    $('.flash > .close-message').click(function () {
        $(this).parent().hide('blind');
        return false;
    });*/

    if ($('.header-sponsor').is(':visible') === true) {
         $('.voice-info').css('min-height', '131px');
    }

    $(window).resize(function () {
        DynamicMeasures.update();
    });

    var mapTooltip, mapContainer, mapButton;

    mapTooltip = new CV.Tooltip({
        text : 'Show Voices on the map.',
        className : 'tooltip-map',
        nowrap: true
    }).render($('.mapit'));

    mapContainer = $('.map-container');
    mapButton = $('.map-btn');
    window.mainMap = new CV.MainMap().render(mapContainer);

    mapButton.bind('click', function () {
        mapContainer.toggleClass('shown');
        mapButton.toggleClass('map-active');

        if (mapButton.hasClass('map-active')) {
            mapTooltip.updateText("Hide Voices on the map.");
            mainMap.activate();
        } else {
            mapTooltip.updateText("Show Voices on the map.");
            mainMap.deactivate();
        }

        return false;
    });

});
