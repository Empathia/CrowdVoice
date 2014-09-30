Class('ImageGalleryController')({
    prototype : {
        imageSelector       : '', //the image widget selector
        paginationSelector  : '', //the image widget selector
        currentToken        : 0,
        init : function (element, eventReceiver){
            this.element            = element;// the images container
            this.eventReceiver      = eventReceiver;
            this.navPrev            = this.element.find(); // the navigation handler for prev
            this.navNext            = this.element.find(); // the navigation handler for next
            this.paginationItems    = [];
            this.imageGalleryItems  = [];

            this._fillEntries();
            this.bindEvents();
        },
        bindEvents: function () {
            var that = this;
            this.element.on('pagination:click', function(ev, data){
                that.goToSlide(data);
            }).on('element:mention', function(ev, data){
                that.eventReceiver.trigger('element:mention', data);
            });

            this.navPrev.on('click', function(){
                that.prev();
            });
            this.navNext.on('click', function(){
                that.next();
            });
        },
        next: function(){
            var newToken = this.currentToken + 1;
            if (newToken > this.imageGalleryItems.length - 1){
                newToken = 0;
            }
            this.currentToken = newToken;
            this.goToSlide(this.currentToken);
        },
        prev: function(){
            var newToken = this.currentToken - 1;
            if (newToken > 0){
                newToken = this.imageGalleryItems.length - 1;
            }
            this.currentToken = newToken;
            this.goToSlide(this.currentToken);
        },
        goToSlide: function(index) {
            var item;
            for (item in this.imageGalleryItems){
                this.imageGalleryItems[item].deactivate();
            }
            this.imageGalleryItems[index].activate();
            this.paginationItems[index].activate();
        },
        _fillEntries : function(){
            this.element.find(this.paginationSelector).each(function(el, i) {
                that.paginationItems[i] = new paginationWidget(el, that.element, i);
            });
            this.element.find(this.imageSelector).each(function(el, i) {
                that.imageGalleryItems[i] = new ImageWidget(el, that.element, i);
            });
        }
    }
});