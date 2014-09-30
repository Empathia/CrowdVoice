Class('DetailsViewController')({
    /*jshint multistr: true */
    GALLERY_TEMPLATE        :   '<div class="gallery-content media-container"></div>',
    CAPTION_PAGINATION      :   '<div class="caption-pagination">\
                                    <div class="caption-container"></div>\
                                    <div class="pagination-container"></div>\
                                </div>',
    NAVIGATION_TEMPLATE     :   '<div class="gallery-navigation">\
                                    <div class="prev arrow"></div>\
                                    <div class="next arrow"></div>\
                                </div>',
    IMAGE_TEMPLATE          :   '<div class="gallery-item-container">\
                                    <img class="gallery-item" src="" data-mention="" />\
                                </div>',
    VIDEO_TEMPLATE          :   '<div class="gallery-item-container">\
                                    <iframe class="gallery-item" frameborder="0" src="" width="725"></iframe>\
                                </div>',
    CAPTION_TEMPLATE        :   '<div class="caption"></div>',
    PAGINATION_TEMPLATE     :   '<div class="pagination-item"></div>',
    OVERLAY                 :   '<div class="overlay-mask event-overlay"></div>',
    SOURCES_WRAPPER         :   '<div class="sources-content media-container"><ul class="sources-list"></ul></div>',
    SOURCE_TEMPLATE         :   '<li class="source"><a href="" target="_blank"></a></li>',
    prototype : {
        isHidden: true,
        init : function (element){
            this.element            = element;//$('.detailed-view-wrapper')
            this.header             = this.element.find('.detailed-view-header');
            this.thumbnailReceiver  = this.element.find('.element-thumbnail .thumbnail');
            this.titleReceiver      = this.element.find('.name');
            this.navigation         = this.element.find('.navigation-icons-container');
            this.contentContainer   = this.element.find('.content-container');
            this.contentWrapper     = this.element.find('.content-wrapper');
            this.imagesContainer    = this.element.find('.image-gallery-container');
            this.videosContainer    = this.element.find('.video-gallery-container');
            this.sourcesContainer   = this.element.find('.sources-container');
            this.contentIcon        = this.navigation.find('.content');
            this.imageIcon          = this.element.find('.imgGallery');
            this.videoIcon          = this.element.find('.videoGallery');
            this.sourcesIcon        = this.element.find('.sources');
            this.closeButton        = this.element.find('.close-view');
            this.calendar           = this.element.find('.calendar-wrapper');
            this.overlay            = $(this.constructor.OVERLAY);
            this.navigationSpace    = 156;

            this.bindEvents();
        },
        bindEvents : function(){
            var that = this;
            this.element.bind('element:details', function(ev, data){
                that.growView(data);
            }).bind('timelineData:served', function(ev,data){
                that._applyData(data);
            }).bind('gallery:updateSize', function(ev, data){
                that._applyNewWidth(data);
            }).bind('gallery:switch', function(){
                that._resetGalleries();
            }).bind('player:enabled', function(){
                that._hidePreloaderMask();
            });
            this.closeButton.bind('click', function(ev) {
                var index = that.sourceElement[0].id.substring(8,11);
                that.shrinkView();
                that.element.trigger('detailView:close', index);
            });
            this.contentIcon.bind('click', function() {
                if (!$(this).is('.active')){
                    return that.toContentView();
                }
            });
            this.imageIcon.bind('click', function() {
                if(!$(this).is('.disabled, .active')){
                    return that.toImageGallery();
                }
            });
            this.videoIcon.bind('click', function() {
                if (!$(this).is('.disabled, .active')){
                    return that.toVideoGallery();
                }
            });
            this.sourcesIcon.bind('click', function() {
                if (!$(this).is('.disabled, .active')) {
                    return that.toSourcesView();
                }
            });
            $(window).resize(function(){
                // that.refreshScroller();
                that.applyResize();
            }).bind('keyup', function(ev){
                if (that.currentView === 'imgGallery') {
                    if (ev.which == 38) {
                        that.imagesContainer.trigger('gallery:next');
                    } else if (ev.which == 40) {
                        that.imagesContainer.trigger('gallery:prev');
                    }
                }
            });
        },
        // bindMention: function(){
            // var that = this;
            // this.element.find('.mention').bind('mouseenter', function(ev, data){
            //     var elementId = ev.currentTarget.getAttribute('data-reference').substring(3,5);
            //     that.element.trigger('element:mention', elementId);
            // }).bind('mouseleave', function(){
            //     that.element.trigger('elements:reset');
            // });
        // },
        _bindOverlay: function(){
            var that = this;
            this.overlay.click(function(){
                var index = that.sourceElement[0].id.substring(8,11);
                that.shrinkView();
                that.element.trigger('detailView:close', index);
            });
        },
        growView: function(source) {
            var that    = this;
            this.sourceElement = $('#element-'+source);

            this.cleanGalleries();
            this._getContent(source);
            this.closeButton.attr('data-source', source);
            if (this.isHidden) {
                this.overlay.prependTo(this.element.parent());
                this.contentPreloader = $(document.createElement('div'))
                    .addClass('modal-preloader')
                    .insertBefore(this.element)
                    .css({
                        opacity     : '0',
                        left        : this.sourceElement.offset().left + 'px',
                        top         : this.sourceElement.offset().top + 'px'
                    });
                this.element.css({'display':'block','visibility':'hidden'});
                this.refreshScroller();
                this.toContentView();
                // this.element.trigger('elements:reset');
                
                setTimeout(function(){
                    that.sourceElement.trigger('element:highlight');
                }, 350);
            } else {
                this.refreshScroller();
                this.toContentView();
            }
            this.isHidden = false;
            this._bindOverlay();
        },
        _applyNewWidth: function(imgElem){
            // compensation value is (navigation handler width + 28px) * 2 
            var that            = this,
                $imgElem        = $(imgElem),
                nWidth          = this._getNatural(imgElem).width,
                nHeight         = this._getNatural(imgElem).height,
                topBarHeight    = this.header.outerHeight(true) + this.navigation.outerHeight(true),
                bottomBarHeight = this.element.find('.pagination-container').height() !== 0 ? 40 : 0,
                maxWidth        = $(window).width() - this.navigationSpace,
                maxHeight       = this._getMaxHeight(),
                imgHeight, modalHeight, modalWidth;

                modalWidth = nWidth;
                imgHeight  = nHeight;

            if (nWidth > maxWidth) {
                $imgElem.css({
                    width: maxWidth,
                    height: 'auto'
                });
                modalWidth = maxWidth;
                imgHeight = imgElem.height;
            }
            if (imgHeight > maxHeight) {
                $imgElem.css({
                    width: 'auto',
                    height: maxHeight
                });
                modalWidth = imgElem.width;
                imgHeight = maxHeight;
            }
            modalHeight = topBarHeight + imgHeight + bottomBarHeight;

            TweenLite.to([this.element, this.contentPreloader], 0.2, {
                width: modalWidth,
                height: modalHeight,
                marginTop: -(modalHeight/2),
                marginLeft: -(modalWidth/2),
                onComplete: function(){
                    $imgElem.css({width:'', height:''});
                }
            });
        },
        _getNatural: function(DOMelement){
            var img = new Image();
                img.src = DOMelement.src;
                return {width: img.width, height: img.height};
        },
        _hidePreloaderMask: function(){
            var that = this;
            TweenLite.to(this.contentPreloader, 0.5, {
                opacity : 0,
                onComplete: function(){
                    that.contentPreloader.hide();
                }
            });
            this.element[0].style.visibility = 'visible';
        },
        _resetDimensions: function(){
            var that = this;
            this.element.css({
                bottom      : 'auto',
                marginLeft  : '-275px',
                top         : '50%',
                visibility  : 'visible',
                width       : '550px'
            });
            this._contentDimensions();
            this._initContentPreloader();
        },
        _initContentPreloader: function(){
            if (this.isHidden) {
                this.contentPreloader.css({'opacity':'0.3','display':'block'});
            } else {
                this.contentPreloader.css({'opacity':'1','display':'block'});
            }
        },
        _contentDimensions: function() {
            var that            = this,
                animSpeed       = this.isHidden ? 0.7 : 0.3,
                modalValues     = this._getModalHeight(),
                modalHeight     = modalValues[0] > 500 ? 500 : modalValues[0],
                modalMarginTop  = modalValues[1] < -250 ? -250 : modalValues[1];
            this.element.css({
                height      : modalHeight,
                marginTop   : modalMarginTop,
                visibility  : 'hidden'
            });
            TweenLite.to(that.contentPreloader, animSpeed, {
                height      : modalHeight,
                left        : '50%',
                marginLeft  : '-275px',
                marginTop   : modalMarginTop,
                opacity     : '1',
                top         : '50%',
                width       : '550px',
                onComplete  : function(){
                    that._hidePreloaderMask();
                }
            });
        },
        _getMaxHeight: function() {
            var that            = this,
                topLimit        = 34,
                bottomLimit     = 130,
                windowH         = $(window).height(),
                maxHeight       = windowH - topLimit - bottomLimit;
                validValue      = maxHeight > 300 ? maxHeight : 300;
            return validValue;
        },
        _getModalHeight: function() {
            var that            = this,
                modalBottomGap  = 37, // space for the suggest button
                windowH         = $(window).height(),
                maxHeight       = this._getMaxHeight(),
                topBarHeight    = this.header.outerHeight(true) + this.navigation.outerHeight(true),
                contentHeight, modalHeight, modalMarginTop;

            if (that.currentView === 'info') {
                content         = that.contentWrapper.find('.content');
                contentHeight   = content.outerHeight(true);
            } else {
                content         = that.sourcesContainer.find('.source');
                contentHeight   = content.length * content.outerHeight(true);
            }
            modalHeight     = topBarHeight + contentHeight + modalBottomGap;
            modalMarginTop  = (modalHeight / 2) * -1;
            if (modalHeight > maxHeight) {
                modalHeight     = maxHeight;
                modalMarginTop  = ((modalHeight/2) + 50) * -1;
            } else if (modalHeight < 300) {
                modalHeight = 300;
                modalMarginTop  = (modalHeight / 2) * -1;
            }

            return [modalHeight, modalMarginTop];
        },
        shrinkView: function() {
            var that    = this;
            this.cleanGalleries();
            if (!this.isHidden) {
                this.overlay.remove();
                this._shrinkAnimation();
            } else {
                return false;
            }
            this.sourceElement.trigger('element:reset');
            this.isHidden = true;
        },
        _shrinkAnimation: function(){
            var that = this;
            that.element.css('display','none');
            this._initContentPreloader();
            TweenLite.to(this.contentPreloader, 0.3, {
                left        : this.sourceElement.offset().left + 10 +'px',
                marginLeft  : 10,
                top         : this.sourceElement.offset().top + 10 + 'px',
                marginTop   : 10,
                opacity     : 0,
                width       : '60px',
                height      : '60px',
                onComplete: function(){
                    that.contentPreloader.remove();
                }
            });
        },
        _setHeaderHeight: function(){
            var that = this,
                newTop, newHeaderHeight;
            this.titleReceiver.removeAttr('style');
            this.contentContainer.removeAttr('style');
            newHeaderHeight = that.titleReceiver.innerHeight();
            this.titleReceiver.css('height',newHeaderHeight);
            newTop = this.navigation.outerHeight(true) + this.titleReceiver.outerHeight(true);
            this.contentContainer.css('top',newTop);
            this.sourcesContainer.css('top',newTop);
            // 
            this.imagesContainer.css('top',newTop);
            this.videosContainer.css('top',newTop);
        },
        cleanGalleries: function() {
            if (this.imageGallery || this.videoGallery) {
                this.imageGallery.cleanGalleries();
                this.videoGallery.cleanGalleries();
                this.imageGallery = null;
                this.videoGallery = null;
                this.element.find('.media-container').remove();
                this.element.find('.caption-pagination').remove();
                this.element.find('.disabled').removeClass('disabled');
            }
        },
        applyContent: function(content){
            var that = this,
                contentReceiver = this.contentContainer.find('.content');

                this.titleReceiver.text(content.title);
                contentReceiver.html(content.description);
                this.thumbnailReceiver.prop('src', content.thumbnail);
                this._fillCalendar();
                // this.bindMention();
        },
        applyResize: function () {
            var that            = this,
                currentImage    = this.element.find('img.active')[0];
            if (!this.isHidden) {
                clearTimeout(this.resizeTimeout);
                this.resizeTimeout = setTimeout(function(){
                    if (that.currentView === 'imgGallery') {
                        that._applyNewWidth(currentImage);
                    } else if(that.currentView === 'info' || that.currentView === 'sources') {
                        that._setMaxModalDimensions();
                    } else if(that.currentView === 'videoGallery') {
                        that._videoModalWidth();
                    }
                }, 300);
            }
        },
        _setMaxModalDimensions: function(){
            var modalSpaceX     = $(window).width() - this.navigationSpace,
                minimumSpaceX   = 550,
                maxHeight       = this._getMaxHeight(),
                minHeight       = 300,
                currentHeight   = this.element.height(),
                verticalValues  = this._getModalHeight(),
                modalHeight     = verticalValues[0] < 500 ? verticalValues[0] : 500,
                modalMarginTop  = verticalValues[1] < -250 ? -250 : verticalValues[1],
                newMargin;
            if (maxHeight < minHeight) {
                maxHeight = minHeight;
            }
            if (modalSpaceX <= minimumSpaceX) {
                this.element.css('width','60%');
                newMargin = (this.element.width() / 2) * -1;
                this.element.css('marginLeft', newMargin);
            } else {
                if (this.element[0].style.width === '60%') {
                    this._resetDimensions();
                }
            }
            if (currentHeight !== modalHeight) {
                this.element.css({
                    height      : modalHeight,
                    marginTop   : modalMarginTop
                });
            }
        },
        _videoModalWidth: function(){
            var that            = this,
                modalSpaceX     = $(window).width() - this.navigationSpace,
                topBarHeight    = this.header.outerHeight(true) + this.navigation.outerHeight(true),
                minimumSpaceX   = 550,
                currentWidth    = this.element.width(),
                currentHeight   = this.element.height(),
                maxModalHeight  = this._getMaxHeight(),
                videoHeight, modalHeight;
            if (modalSpaceX < 180) {
                modalSpaceX = 180;
            } else if (modalSpaceX > 640){
                modalSpaceX = 640;
            }
            videoHeight = ((modalSpaceX * 3)/4)+ topBarHeight;
            if (videoHeight < maxModalHeight) {
                modalHeight =  videoHeight;
            } else {
                modalHeight = maxModalHeight;
                modalSpaceX = ((modalHeight-topBarHeight)*4)/3;
            }
            if (currentWidth !== modalSpaceX || currentHeight !== modalHeight) {
                // the following rule activates the content preloader mask
                // due windows stuttering video render when scaling
                if (navigator.appVersion.indexOf("Win") > -1) {
                    this._initContentPreloader();
                }
                TweenLite.to([this.element, this.contentPreloader], 0.5, {
                    width       : modalSpaceX,
                    marginLeft  : -(modalSpaceX/2),
                    height      : modalHeight,
                    marginTop   : -(modalHeight/2),
                    top         : '50%',
                    onComplete: function(){
                        that._hidePreloaderMask();
                    }
                });
            }
        },
        _fillCalendar: function(){
            var that = this,
                dayContainer    = this.calendar.find('.day-name'),
                monthContainer  = this.calendar.find('.month-name'),
                yearContainer   = this.calendar.find('.year-name'),
                date            = this.currentElementData.event_date,
                dayValue        = date.substring(8,10),
                monthValue      = parseInt(date.substring(5,7), 10),
                yearValue       = date.substring(0,4),
                monthNames      = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
            dayContainer.text(dayValue);
            monthContainer.text(monthNames[monthValue - 1]);
            yearContainer.text(yearValue);
        },
        refreshScroller: function() {
            this._setHeaderHeight();
        },
        toContentView: function () {
            this.currentView = 'info';
            this._resetGalleries();
            this._resetViews();

            this.contentIcon.addClass('active');
            this.contentContainer.addClass('active');
            this._resetDimensions();
            this._setMaxModalDimensions();
        },
        toImageGallery: function() {
            this.currentView = 'imgGallery';
            this._resetGalleries();
            this._resetViews();

            this.imageIcon.addClass('active');
            this.imagesContainer.addClass('active');
            this.imageGallery.goToSlide(0);

            this._setHeaderHeight();
        },
        toVideoGallery: function(videoPaths) {
            this.currentView = 'videoGallery';
            this._resetViews();

            this.videoIcon.addClass('active');
            this.videosContainer.addClass('active');
            this.videoGallery.goToSlide(0);

            this._setHeaderHeight();
            this._videoModalWidth();
        },
        toSourcesView: function () {
            this.currentView = 'sources';
            this._resetGalleries();
            this._resetViews();

            this.sourcesIcon.addClass('active');
            this.sourcesContainer.addClass('active');
            this._resetDimensions();
        },
        _resetGalleries: function(){
            this.videoGallery.resetVideoGallery();
            this.imageGallery.resetImageGallery();
        },
        _resetViews: function() {
            this.contentIcon.removeClass('active');
            this.contentContainer.removeClass('active');
            this.imageIcon.removeClass('active');
            this.videoIcon.removeClass('active');
            this.imagesContainer.removeClass('active');
            this.videosContainer.removeClass('active');
            this.sourcesIcon.removeClass('active');
            this.sourcesContainer.removeClass('active');
        },
        _getContent: function(elemId) {
            //this allows _applyData when content is served
            this.element.trigger('details:getElementData', elemId);
        },
        _applyData: function(data) {
            var that         = this,
                contentObj   = {
                    title       :data.name,
                    description :data.description,
                    thumbnail   :data.background_image
                };
            this.currentElementData = data;
            this.applyContent(contentObj);
            this._fillSources();
            this._fillImages();
            this._fillVideos();
            this._initializeGalleries();
        },
        _fillSources: function() {
            var currentSources = this.currentElementData.sources;
            if (currentSources) {
                var sourcesWrapper = $(this.constructor.SOURCES_WRAPPER),
                    sourceTemplate = $(this.constructor.SOURCE_TEMPLATE);
                for (var i = 0; i < currentSources.length; i++) {
                    sourceTemplate.clone()
                        .find('a')
                        .prop('href', currentSources[i].url)
                        .text(currentSources[i].label)
                        .end()
                        .prependTo(sourcesWrapper.find('.sources-list'));
                }
                sourcesWrapper.appendTo(this.sourcesContainer);
            } else {
                this.sourcesIcon.addClass('disabled');
            }
        },
        _fillImages: function() {
            var galleryTemplate     = $(this.constructor.GALLERY_TEMPLATE),
                imageTemplate       = $(this.constructor.IMAGE_TEMPLATE),
                captionPagination   = $(this.constructor.CAPTION_PAGINATION),
                navigation          = $(this.constructor.NAVIGATION_TEMPLATE),
                captionItem         = $(this.constructor.CAPTION_TEMPLATE),
                paginationItem      = $(this.constructor.PAGINATION_TEMPLATE),
                captionContainer    = captionPagination.find('.caption-container'),
                paginationContainer = captionPagination.find('.pagination-container'),
                prevArrow           = navigation.find('.prev'),
                imagesArray         = this.currentElementData.images,
                index;
            this.imagesContainer.removeClass('no-nav');
            if (imagesArray.length) {
                if (imagesArray.length > 1) {
                    navigation.appendTo(paginationContainer);
                } else {
                    this.imagesContainer.addClass('no-nav');
                }
                for (index in imagesArray) {
                    imageTemplate.clone()
                        .find('img')
                        .prop('src', imagesArray[index].image)
                        // .attr('data-mention', imagesArray[index].related_to)
                        .attr('data-explicit', imagesArray[index].is_explicit)
                        .end()
                        .prependTo(galleryTemplate);
                    if (imagesArray[index].caption !== null) {
                        captionItem.clone().text(imagesArray[index].caption).prependTo(captionContainer);
                    } else {
                        //insert empty item since will be added to the gallery array
                        captionItem.clone().prependTo(captionContainer);
                    }
                    paginationItem.clone().insertAfter(prevArrow);
                }

                galleryTemplate.appendTo(this.imagesContainer);
                captionPagination.appendTo(this.imagesContainer);
            } else {
                this.imageIcon.addClass('disabled');
            }
        },
        _fillVideos: function() {
            var galleryTemplate     = $(this.constructor.GALLERY_TEMPLATE),
                videoTemplate       = $(this.constructor.VIDEO_TEMPLATE),
                captionPagination   = $(this.constructor.CAPTION_PAGINATION),
                captionItem         = $(this.constructor.CAPTION_TEMPLATE),
                paginationItem      = $(this.constructor.PAGINATION_TEMPLATE),
                navigation          = $(this.constructor.NAVIGATION_TEMPLATE),
                captionContainer    = captionPagination.find('.caption-container'),
                paginationContainer = captionPagination.find('.pagination-container'),
                prevArrow           = navigation.find('.prev'),
                videosArray         = this.currentElementData.videos,
                index;

            this.videosContainer.removeClass('no-nav');
            if (videosArray.length) {
                if (videosArray.length > 1) {
                    navigation.appendTo(paginationContainer);
                } else {
                    this.videosContainer.addClass('no-nav');
                }
                for (index in videosArray) {
                    var filteredUrl = videosArray[index].video
                                        .replace('youtube.com/','youtube.com/embed/')
                                        .replace('watch?feature=player_embedded&v=','')
                                        .replace('watch?v=','');
                    var videoId = filteredUrl
                                    .replace('http://','')
                                    .replace('https://','')
                                    .replace('www.youtube.com/embed/','');
                    videoTemplate.clone()
                        .find('iframe')
                        // .prop('src', filteredUrl)
                        .prop('id', 'video_'+videoId)
                        .attr('data-origin', filteredUrl)
                        // .attr('data-mention', videosArray[index].related_to)
                        .attr('data-explicit', videosArray[index].is_explicit)
                        .end()
                        .prependTo(galleryTemplate);
                    if (videosArray[index].caption){
                        captionItem.clone()
                            .html(videosArray[index].caption)
                            .prependTo(captionContainer);
                    } else {
                        captionItem.clone().prependTo(captionContainer);
                    }
                    paginationItem.clone().insertAfter(prevArrow);
                }

                galleryTemplate.appendTo(this.videosContainer);
                captionPagination.appendTo(this.videosContainer);
            } else {
                this.videoIcon.addClass('disabled');
            }
        },
        _initializeGalleries: function(){
            this.imageGallery = new GalleryController(this.imagesContainer, 'image', this.element);
            this.videoGallery = new GalleryController(this.videosContainer, 'video', this.element);
        }
    }
});