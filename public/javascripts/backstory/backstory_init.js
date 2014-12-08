(function(){
    var backstoryTimelineWidget;

    /*
    var script = document.createElement('script');
    var docHead = document.getElementsByTagName('head')[0];
    var ytAPIURL= 'https://www.youtube.com/iframe_api';
    */

    //docHead.appendChild(script);
    //script.src = ytAPIURL;

    $(document.body).addClass('backstory');

    backstoryTimelineWidget = new CV.BackstoryController();

    new CV.VoiceHeaderNav({
        element : $('.voice-info')
    });

    new SidebarToggler({showSidebar: false});

    DynamicMeasures.update();
    backstoryTimelineWidget.run(document.querySelector('.cv-backstory-ui-wrapper'));

})();
