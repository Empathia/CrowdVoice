$(function(){
    var _mapCreated, $mapWrapper, lat, lng, voiceMapWidget, $mapLink;

    _mapCreated = false;
    $mapWrapper = $('.infographics-map-wrapper');
    lat = $mapWrapper.data('lat');
    lng = $mapWrapper.data('lng');
    voiceMapWidget = new CV.Map({zoom : 8}).render($mapWrapper);
    $mapLink = $(document.querySelector('.info-tool-link.map'));

    new SidebarToggler({showSidebar: false});
    //Sizing script
    new InfoPane('.right-pane-container');
    //Wall logic
    new InfoWall('.infobox-wall-container', infoboxData);

    DynamicMeasures.update();

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
});
