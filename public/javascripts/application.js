/* check if is device */
window.isDevice = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i).test(navigator.userAgent);

if (window.hasTouch()) document.addEventListener("touchstart", function t(){}, true);

/* Inyect cvmap.js - Internal API to control Google Maps */
window.appendMapScript = function ( callback ) {
    var script = document.createElement('script');
    script.src = '/javascripts/cv/cvmap.js';
    document.getElementsByTagName('head')[0].appendChild( script );

    script.onreadystatechange = script.onload = function() {
        var state = script.readyState;
        if ( !state || /loaded|complete/.test(state) ) {
            return callback && callback();
        }
    };
    return script;
};

/* Inyect Google Map script */
window.appendGoogleMapsScript = function( callback ) {
    var script = document.createElement('script');
    script.src = "https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false";
    if ( callback ) {
        script.src += "&callback=" + callback;
    }

    document.getElementsByTagName('head')[0].appendChild( script );
    return script;
};

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

    var aboutTooltip, mapTooltip, mainContainer, mapContainer, mapButton,
        sidebarVoice, infoSidebar, _mapVoices, initVoicesMap;

    aboutTooltip = new Tooltip2({
        text : 'Find more info about CrowdVoice here!',
        className : 'more-about-cv-tooltip',
        position : 'right'
    }).render($('.about-link-wrapper'));

    mapTooltip = new Tooltip2({
        text : 'Show Voices on the map.',
        className : 'tooltip-map',
        nowrap: true
    }).render($('.mapit'));

    _mapVoices      = null;
    mainContainer   = $('.main-container');
    mapContainer    = $('.map-container');
    mapButton       = $('.map-btn');
    sidebarVoice    = $('.voice');
    infoSidebar     = $('.info-sidebar');

    initVoicesMap = function() {
        _mapVoices = new CVMap( mapContainer, {
            zoom    : 2,
            center  : new google.maps.LatLng(0, 0)
        });

        CVMap.getLocations(function (locations) {
            for (var i = 0; i < locations.length; i++) {
                var loc = locations[i].location,
                    position = null,
                    label = locations[i].voices.length,
                    title = label + ' voice(s) in ' + loc,
                    content = '<ul class="map-voices">';

                for (var j = 0; j < locations[i].voices.length; j++) {
                    var voice = locations[i].voices[j];
                    if ( !position ) {
                        position = CVMap.at(voice.latitude, voice.longitude);
                    }
                    content += '<li><a href="/' + voice.slug + '">' + voice.title + '</a></li>';
                }
                content += '</ul>';

                _mapVoices.addPin(position, title, label, content);
            }
        });
    };

    window.initializeVoicesMap = function() {
        if ( typeof CVMap === "undefined" ) {
            window.appendMapScript( initVoicesMap );
        } else {
            initVoicesMap();
        }
    };

    mapButton.bind('click', function () {
        mapContainer.toggleClass('shown');
        mapButton.toggleClass('map-active');

        if (mapButton.hasClass('map-active')) {
            mapTooltip.updateText("Hide Voices on the map.");
        } else {
            mapTooltip.updateText("Show Voices on the map.");
        }

        if (!_mapVoices) {
            if (typeof google === "undefined") {
                window.appendGoogleMapsScript("initializeVoicesMap");
            } else {
                initializeVoicesMap();
            }
        }

        return false;
    });

    $('.top-left-navigation, .voice-info-tools').click(function(){
        $(this).toggleClass('active');
    });

    $('.searchable li a[href="'+location.pathname+'?all=true"]').parent().addClass('select');

    $('[data-action=submit]').bind("click", function () {
        $(this).closest('form').submit();
        return false;
    });

    $('.voice-search input[placeholder]').placeholder();

    if($('.flash').length) {
        setTimeout(function () {
            $('.flash').hide('blind');
        }, 5000);
    }

    $('.flash > .close-message').click(function () {
        $(this).parent().hide('blind');
        return false;
    });

    if ( $('.header-sponsor').is(':visible') === true ) {
         $('.voice-info').css('min-height', '131px');
    }

    $(window).resize(function () {
        DynamicMeasures.update();
    });
});
