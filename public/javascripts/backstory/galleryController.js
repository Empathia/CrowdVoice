Class('GalleryController')({
    prototype : {
        elementSelector     : '.gallery-item',
        paginationSelector  : '.pagination-item',
        captionSelector     : '.caption',
        currentToken        : 0,
        init : function (element, type, eventReceiver){
            this.element            = element;// the gallery elements container
            this.galleryType        = type;
            this.eventReceiver      = eventReceiver;
            this.navPrev            = this.element.find('.prev'); // the navigation handler for prev
            this.navNext            = this.element.find('.next'); // the navigation handler for next
            this.paginationItems    = [];
            this.captionItems       = [];
            this.galleryItems       = [];

            this._fillEntries();
            this.bindEvents();
        },
        bindEvents: function () {
            var that = this;
            this.element.bind('pagination:click', function(ev, data){
                that.goToSlide(data);
            }).bind('gallery:next', function(){
                that.next();
            }).bind('gallery:prev', function(){
                that.prev();
            });

            this.navPrev.bind('click', function(){
                that.prev();
            });
            this.navNext.bind('click', function(){
                that.next();
            });
        },
        next: function(){
            var newToken = this.currentToken + 1;
            if (newToken > this.galleryItems.length - 1){
                newToken = 0;
            }
            this.currentToken = newToken;
            this.goToSlide(this.currentToken);
        },
        prev: function(){
            var newToken = this.currentToken - 1;
            if (newToken < 0){
                newToken = this.galleryItems.length - 1;
            }
            this.currentToken = newToken;
            this.goToSlide(this.currentToken);
        },
        goToSlide: function(index) {
            var that = this,
                itemsCount = this.galleryItems.length;
            if (itemsCount > 0) {
                for (var item = 0; item < itemsCount; item++){
                    if (item !== index) {
                        this.galleryItems[item].deactivate();
                        this.paginationItems[item].deactivate();
                        this.captionItems[item].deactivate();
                    }
                }
            } else {
                return false;
            }
            this.eventReceiver.trigger('gallery:switch');
            clearTimeout(this.activationTImeout);
            this.activationTImeout = setTimeout(function(){
                that.galleryItems[index].activate();
            }, 300);
            this.paginationItems[index].activate();
            this.captionItems[index].activate();
            this.currentToken = index;
        },
        cleanGalleries: function(){
            this.captionItems       = [];
            this.galleryItems       = [];
        },
        resetVideoGallery: function() {
            for (var i = 0; i < this.galleryItems.length; i++){
                this.galleryItems[i].deactivate();
            }
        },
        resetImageGallery: function() {
            for (var i = 0; i < this.galleryItems.length; i++){
                this.galleryItems[i].deactivate();
            }
        },
        _fillEntries : function(){
            var that                = this,
                galleryElements     = this.element.find(this.elementSelector),
                paginationElements  = this.element.find(this.paginationSelector),
                captionElements     = this.element.find(this.captionSelector);

            // create gallery, caption and pagination items
            for (var i = 0; i < galleryElements.length; i++){
                if (that.galleryType        === 'image') {
                    that.galleryItems[i] = new ImageWidget($(galleryElements[i]), that.eventReceiver, i);
                } else if (that.galleryType === 'video') {
                    that.galleryItems[i] = new VideoWidget($(galleryElements[i]), that.eventReceiver, i);
                }
                that.paginationItems[i]  = new PaginationWidget($(paginationElements[i]), that.element, i);
                that.captionItems[i]     = new CaptionWidget($(captionElements[i]), that.element, i);
            }
        }
    }
});