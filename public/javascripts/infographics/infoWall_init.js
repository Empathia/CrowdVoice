$(document).ready(function(){
    var voiceInfoBox    = $('.voice-info');
    var voiceSubtitle   = voiceInfoBox.find('.voice-subtitle');
    new SidebarToggler({showSidebar: false});
    //Sizing script
    new InfoPane('.right-pane-container');
    //Wall logic
    new InfoWall('.infobox-wall-container', infoboxData);

    DynamicMeasures.update();

  });
