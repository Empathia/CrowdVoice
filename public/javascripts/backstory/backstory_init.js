(function(){
    var _mapCreated, $mapWrapper, lat, lng, voiceMapWidget, $mapLink, backstoryTimelineWidget;

    /*
    var script = document.createElement('script');
    var docHead = document.getElementsByTagName('head')[0];
    var ytAPIURL= 'https://www.youtube.com/iframe_api';
    */

    //docHead.appendChild(script);
    //script.src = ytAPIURL;

    $(document.body).addClass('backstory');

    _mapCreated = false;
    $mapWrapper = $('.backstory-map-wrapper');
    lat = $mapWrapper.data('lat');
    lng = $mapWrapper.data('lng');
    voiceMapWidget = new CV.Map({zoom : 8}).render($mapWrapper);
    $mapLink = $(document.querySelector('.info-tool-link.map'));
    backstoryTimelineWidget = new CV.BackstoryController();

    new SidebarToggler({showSidebar: false});

    DynamicMeasures.update();
    backstoryTimelineWidget.run(document.querySelector('.cv-backstory-ui-wrapper'));

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
})();
