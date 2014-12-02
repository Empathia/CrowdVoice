(function(){
    var timelineWrapper = $('.timeline-wrapper');
    /*var timelineController = new TimelineController(timelineWrapper);
    var script = document.createElement('script');
    var docHead = document.getElementsByTagName('head')[0];
    var ytAPIURL= 'https://www.youtube.com/iframe_api';
    */
    var mainSidebar = new SidebarToggler({ showSidebar: false });

    //docHead.appendChild(script);
    //script.src = ytAPIURL;
    $(document.body).addClass('backstory');

    DynamicMeasures.update();

    backstory = new CV.BackstoryController();
    backstory.run(document.querySelector('.cv-backstory-ui-wrapper'));
}).call($);
