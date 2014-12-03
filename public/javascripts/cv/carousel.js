Class('Carousel').inherits(Widget)({
    DEFAULT_IMAGE: "/images/v4/carousel-not-image-found.jpg",
    prototype : {
        description : 'No description set.',
        title : 'No title set',
        index: 0,
        images : [],
        picture : null,
        tooltipLink : null,
        carouselImageElement : null,
        carouselLoaderElement : null,
        carouselLeftArrow : null,
        carouselRightArrow : null,
        carouselCounter : null,

        init : function init(config) {
            Widget.prototype.init.call(this, config);

            this.carouselImageElement = this.element.find('.carousel-image');
            this.carouselLoaderElement = this.element.find('.carousel-loader');
            this.carouselLeftArrow = this.element.find('.left-arrow');
            this.carouselRightArrow = this.element.find('.right-arrow');
            this.carouselCounter = this.element.find('.carousel-counter');
            this.picture = $(document.createElement("img")).attr({
                "id": "img_74dd65a7c6"
            });

            this.carouselImageElement.append(this.picture);

            this._bindEvents();
        },

        _bindEvents: function () {
            this.carouselRightArrow.bind('click', function () {
                if (this.images.length > 1) {
                    return this._updateCurrentImage(this._showNextImage());
                }
            }.bind(this));

            this.carouselLeftArrow.bind('click', function () {
                if (this.images.length > 1) {
                    return this._updateCurrentImage(this._showPrevImage());
                }
            }.bind(this));

            return this;
        },

        _addImage : function _addImage(imageSource) {
            this.images.push(imageSource);
            this._updateCurrentImage(this.current());

            return this;
        },

        _showNextImage : function _showNextImage() {
            this.index++;

            if (this.index >= this.images.length) {
                this.index = 0;
            }

            return this.current();
        },

        _showPrevImage : function _showPrevImage() {
            this.index--;

            if (this.index < 0) {
                this.index = this.images.length - 1;
            }

            return this.current();
        },

        current : function current() {
            if (this.images.length == 0) {
                return this.constructor.DEFAULT_IMAGE;
            }

            return this.images[this.index];
        },

        label : function label() {
            if (this.images.length == 0) {
                return "no images found";
            }

            return (this.index + 1) + " of " + this.images.length;
        },

        serialize : function serialize() {
            return ({
                'description' : this.description,
                'title' : this.title,
                'images' : this.images,
                'current' : this.current()
            });
        },

        show : function show() {
            $('.tooltip-positioner.normal').hide();
            $('.tooltip-positioner.carousel').show();
        },

        hide : function hide() {
            $('.tooltip-positioner.carousel').hide();
            $('.tooltip-positioner.normal').show();
        },

        _updateCurrentImage : function _updateCurrentImage(element) {
            this.carouselImageElement.find('img').attr('src', element);
            this.carouselCounter.text(this.label());
            $('#post_remote_image_url').val(element);
        },

        _updateDescription : function _updateDescription(){
            if (!($('#post_source_url').val().indexOf('.pdf') > 0)) {
                $("#link_description").val(this.description);
            }
        },

        /**
         * @method showLoader <public> [Fuction]
         */
        showLoader : function showLoader() {
            this.carouselImageElement.find("img:not('.carousel-loader')").hide();
            this.carouselLoaderElement.show();

            return this;
        },

        /**
         * @method hideLoader <public> [Fuction]
         */
        hideLoader : function hideLoader() {
            this.carouselImageElement.find("img:not('.carousel-loader')").show();
            this.carouselLoaderElement.hide();

            return this;
        },

        /**
         * @method clear <public> [Fuction]
         */
        clear : function clear() {
            this.carouselCounter.text('');
            $("#link_description").val('');
            this.hide();

            return this;
        },

        /**
         * @method loadHash <public> [Fuction]
         */
        loadHash : function loadHash(hash) {
            var self = this;

            this.index = 0;
            this.title = hash.title;
            this.description = hash.description;
            this.images = [];

            if (hash.error) {
                this.clear();
            } else {
                for (var i = 0; i < hash.images.length; i++) {
                   var imgurl = hash.images[i];
                   var img = new Image();
                   img.src = imgurl;

                   img.onload = function() {
                       if (this.width >= 50 && this.height >= 50) {
                           self._addImage(this.src);
                           if (self.images.length >= 1 && self.picture.attr("src") == self.constructor.DEFAULT_IMAGE) {
                               var src = self.current();

                               if (src != "") {
                                   self.picture.show();
                                   self.picture.attr("src", self.current());
                                   self._updateCurrentImage();
                               }
                           }
                       }
                   };
                }

                this._updateCurrentImage(this.current());
                this._updateDescription();
            }
            return this;
        }
    }
});

