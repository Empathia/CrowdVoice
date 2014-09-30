Class('TimelineElementController')({
    prototype: {
        elemSelector: '.element',
        init: function (element){
            this.element = element; //$('.timeline-container')
            this.timelineElements  = [];
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
            this.element.find(this.elemSelector).each(function(i, el) {
                that.timelineElements[i] = new TimelineElement($(el), that.element, i);
            });
        },
        // maximizeElements: function() {
        //     for (var item = 0; item < this.timelineElements.length; item++) {
        //         this.timelineElements[item].activate();
        //     }
        // },
        // minimizeElements: function() {
        //     for (var item = 0; item < this.timelineElements.length; item++) {
        //         this.timelineElements[item].deactivate();
        //     }
        // },
        highlightElement: function(index) {
            this.resetElements();
            this.timelineElements[index].highlight();
        },
        resetElements: function() {
            for (var item = 0; item < this.timelineElements.length; item++) {
                this.timelineElements[item].resetStyles();
            }
        }
    }
});