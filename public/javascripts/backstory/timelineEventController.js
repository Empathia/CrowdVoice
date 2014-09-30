Class('TimelineEventController')({
    prototype: {
        eventSelector: '.event',
        init: function (element){
            this.element        = element;// $('.timeline-container');
            this.timelineEvents = [];
            this._fillEntries();
            this.bindEvents();
        },
        bindEvents: function() {
            var that = this;
            this.element.bind('timeline:ready', function(ev, data){
                that._fillEntries();
            });
        },
        _fillEntries: function() {
            var that = this;
            this.element.find(this.eventSelector).each(function(i, el) {
                that.timelineEvents[i] = new TimelineEvent($(el), that.element);
            });
        }
    }
});