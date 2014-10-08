$(document).ready(function(){
    var voiceInfoBox    = $('.voice-info');
    new SidebarToggler({showSidebar: false});
    //Sizing script
    new InfoPane('.right-pane-container');
    //Wall logic
    new InfoWall('.infobox-wall-container', infoboxData);

    DynamicMeasures.update();

  });
