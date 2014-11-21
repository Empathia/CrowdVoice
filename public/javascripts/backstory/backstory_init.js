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

    /*
    $.ajax({
        url: '/api/data.json?voice_id=' + window.currentVoice.id,
        success: function(data, status, jqXHR){
            window.backstoryData = data;
            console.log(data)

            console.clear()

            window.xxx = {};
            backstoryData.events.forEach(function(event) {
                var year, month;

                year = event.event_date.substring(0,4);
                month = event.event_date.substring(5,7);

                console.log(year, month);

                if (!xxx[year]) {
                    xxx[year] = {};
                }

                if (!xxx[year][month]) {
                    xxx[year][month] = [];
                }

                xxx[year][month].push(event);
            })
        }
    });
    */
}).call($);
