Class(CV, 'BackstoryGalleryOverlay').inherits(Widget)({
    HTML : '\
    <div class="cv-backstory-overlay">\
        <div class="cv-backstory-overlay__backdrop"></div>\
        <div class="cv-backstory-overlay-arrows">\
            <span class="lines"></span>\
            <div class="cv-backstory-overlay-arrow left">\
                <i class="icon-arrow-left-light"></i>\
            </div>\
            <div class="cv-backstory-overlay-arrow right">\
                <i class="icon-arrow-right-light"></i>\
            </div>\
        </div>\
        <div class="cv-backstory-overlay__wrapper">\
            <div class="cv-backstory-overlay__inner">\
                <div class="cv-backstory-overlay__body clearfix">\
                    <div class="cv-backstory-overlay__gallery cv-pull-left">\
                        <div class="cv-backstory-overlay__shot">\
                            <div class="cv-backstory-overlay__shot-image">\
                                <img />\
                                <iframe frameborder="0" allowfullscreen></iframe>\
                            </div>\
                            <div class="cv-backstory-overlay__shot-caption"></div>\
                            <div class="cv-backstory-overlay__warning-message">\
                                <div class="cv-backstory-overlay__warning-message-inner">\
                                    <div class="cv-backstory-overlay__warning-message-content">\
                                        <p class="title">Warning!</p>\
                                        <p>This image may contain sensitive material.</p>\
                                        <button class="cv-backstory-overlay__warning-button-show cv-button">Click To View</button>\
                                    </div>\
                                </div>\
                            </div>\
                        </div>\
                        <div class="cv-backstory-overlay__gallery-nav"></div>\
                    </div>\
                    <div class="cv-backstory-overlay__info cv-pull-right">\
                        <div class="cv-backstory-overlay__info-header">\
                            <a href="#" alt="close" class="close-icon icon-x cv-dynamic-hover-text-color"></a>\
                            <p class="cv-backstory-overlay__info-date">{{May 15, 2014}}</p>\
                            <p class="cv-backstory-overlay__info-title">{{title}}</p>\
                        </div>\
                        <div class="cv-backstory-overlay__info-body">\
                            <div class="cv-backstory-overlay__info-body-inner js-scroll-light">\
                                <div class="cv-backstory-overlay__info-body-inner-content">\
                                    <p class="cv-backstory-overlay__info-description">{{description}}</p>\
                                    <p>\
                                        <a class="cv-backstory-overlay__info-suggest-correction" href="#" target="_blank">Suggest a Correction</a>\
                                    </p>\
                                </div>\
                            </div>\
                            <a href="#" class="cv-backstory-overlay__sources-link cv-dynamic-text-color">Sources ›</a>\
                            <div class="cv-backstory-overlay__sources">\
                                <a href="#" class="cv-backstory-overlay__sources-close cv-dynamic-text-color">Close ›</a>\
                                <ul class="sources"></ul>\
                            </div>\
                        </div>\
                    </div>\
                </div>\
            </div>\
        </div>\
    </div>\
    ',
    SUGGESTION_MAILTO: "mailto:crowdvoice@mideastyouth.com?subject=I%20have%20a%20correction&body=I'd%20like%20to%20suggest%20a%20correction%20for%20the%20topic%20",

    prototype : {
        _document : null,
        _window : null,

        MIN_SIZE : 520,
        ARROWS_WIDTH : (84 * 2),
        SIDEBAR_WIDTH : 310,
        availableSpaceWidth : null,
        availableSpaceHeight : null,
        lastMaxWidth : 0,
        lastMaxHeight : 0,
        _temporalImage : null,

        /*
         * BackstoryGalleryCarrousel instance reference holder.
         */
        _carrousel : null,

        /**
         * Holds the reference to scrollpane API to call its methods.
         * @property _infoBodyScrollAPI <private> [Object]
         */
        _infoBodyScrollAPI : null,

        init : function init(config) {
            Widget.prototype.init.call(this, config);
            console.log('timeline gallery overlay');

            this._document = $(document);
            this._backropElement = this.element.find('.cv-backstory-overlay__backdrop');
            this._bodyElement = this.element.find('.cv-backstory-overlay__body');
            this._imageElement = this.element.find('.cv-backstory-overlay__shot-image > img');
            this._iframeElement = this.element.find('.cv-backstory-overlay__shot-image > iframe');
            this._shotCaptionElement = this.element.find('.cv-backstory-overlay__shot-caption');
            this._warningMessage = this.element.find('.cv-backstory-overlay__warning-message');
            this._warningButtonView = this.element.find('.cv-backstory-overlay__warning-button-show');
            this._carouselWrapperElement = this.element.find('.cv-backstory-overlay__gallery-nav');
            this._headerElement = this.element.find('.cv-backstory-overlay__info-header');
            this._infoBodyScrollableElement = this.element.find('.cv-backstory-overlay__info-body-inner').jScrollPane({
                autoReinitialise : false
            });
            this._infoBodyScrollAPI = this._infoBodyScrollableElement.data('jsp');
            this._closeElement = this.element.find('.cv-backstory-overlay__info-header > .close-icon');
            this._dateElement = this.element.find('.cv-backstory-overlay__info-date');
            this._titleElement = this.element.find('.cv-backstory-overlay__info-title');
            this._descriptionElement = this.element.find('.cv-backstory-overlay__info-description');
            this._suggestCorrectionElement = this.element.find('.cv-backstory-overlay__info-suggest-correction');
            this._sourcesLinkElement = this.element.find('.cv-backstory-overlay__sources-link');
            this._sourcesElement = this.element.find('.cv-backstory-overlay__sources');
            this._sourcesElementList = this._sourcesElement.find('ul');
            this._sourceCloseButton = this._sourcesElement.find('.cv-backstory-overlay__sources-close');
            this._arrows = this.element.find('.cv-backstory-overlay-arrows');
            this._prevArrow = this.element.find('.cv-backstory-overlay-arrow.left');
            this._nextArrow = this.element.find('.cv-backstory-overlay-arrow.right');

            this._bindEvents();
        },

        _bindEvents : function _bindEvents() {
            this._backropElement.bind('click', this.deactivate.bind(this));

            this._closeElement.bind('click', function(ev) {
                ev.preventDefault();
                this.deactivate();
            }.bind(this));

            this._prevArrow.bind('click', function() {
                window.CV.backstoryUIComponent.loadPreviousGallery();
            }).bind('mouseenter', function() {
                this._arrows.addClass('past-intent');
            }.bind(this)).bind('mouseleave', function() {
                this._arrows.removeClass('past-intent');
            }.bind(this));

            this._nextArrow.bind('click', function() {
                window.CV.backstoryUIComponent.loadNextGallery();
            }).bind('mouseenter', function() {
                this._arrows.addClass('future-intent');
            }.bind(this)).bind('mouseleave', function() {
                this._arrows.removeClass('future-intent');
            }.bind(this))


            this._sourcesLinkElement.bind('click', function(ev) {
                ev.preventDefault();
                this._sourcesElement.addClass('active');
            }.bind(this));

            this._sourceCloseButton.bind('click', function(ev) {
                ev.preventDefault();
                this._sourcesElement.removeClass('active');
            }.bind(this));

            this._warningButtonView.bind('click', function(ev) {
                this._warningMessage.hide();
            }.bind(this));

            return this;
        },

        update : function update(data) {
            var day, month, year, date;

            year = data.event_date.substring(0,4);
            month = data.event_date.substring(5,7);
            day = data.event_date.substring(8,10);
            date = CV.Utils.getMonthShortName(month) + " " + day + ", " + year;

            this._dateElement.text(date);
            this._titleElement.text(data.name);
            this._descriptionElement.text(data.description);
            this._suggestCorrectionElement.attr('href', this.constructor.SUGGESTION_MAILTO + data.name);
            this._sourcesLinkElement.hide();

            if (this._carrousel) {
                this._carrousel.destroy();
            }

            if (data.images.concat(data.videos).length) {
                this.appendChild(new CV.BackstoryGalleryCarrousel({
                    name : '_carrousel'
                })).addThumbs(data.images.concat(data.videos)).render(this._carouselWrapperElement);

                /* activate the first/default option */
                this._carrousel.activateByIndex(0);
            }

            this._sourcesElementList.empty();
            (data.sources || []).forEach(function(source)  {
                this._sourcesElementList.append(
                    $('<li class="source"><a href="' + source.url + '" target="_blank">' + source.label + '</a></li>')
                )
            }, this);

            year = month = day = date = null;
        },

        updateImage : function updateImage(data)  {
            this._imageElement.hide();
            this._iframeElement.hide().attr('src', '');
            this._shotCaptionElement.hide();
            this._sourcesLinkElement.hide();

            if (data.is_explicit) {
                this._warningMessage.show();
            } else {
                this._warningMessage.hide();
            }

            if (data.image) {
                this._temporalImage = $(new Image());
                this._temporalImage.attr('src', data.image);

                this.availableSpaceWidth = (window.innerWidth - (this.ARROWS_WIDTH));
                this.availableSpaceHeight = (window.innerHeight - (40)); // 40 = keep some vertical space

                this._temporalImage.unbind('load').bind('load', this._imageLoadHandler.bind(this, data));
            } else {
                this._iframeElement[0].src = "//www.youtube.com/embed/" + data.videoID;
                this._iframeElement.show();
                this._updateGalleryInfo(data);
            }

            return this;
        },

        _imageLoadHandler : function _imageLoadHandler(data, ev) {
            var _newWidth, _newHeight, _aspectRatio;
            var imageWidth = ev.currentTarget.naturalWidth;
            var imageHeight = ev.currentTarget.naturalHeight;

            // calc width
            if ((imageWidth + this.SIDEBAR_WIDTH) >= this.availableSpaceWidth)  {
                _newWidth = this.availableSpaceWidth;
                _aspectRatio = Math.min(imageWidth / (this.availableSpaceWidth - 310));
            } else if (imageWidth < this.MIN_SIZE) {
                _newWidth = this.MIN_SIZE;
            } else {
                _newWidth = imageWidth + 310;
            }

            // calc height
            if (_aspectRatio) {
                _newHeight = ~~((imageHeight / _aspectRatio) + 76);

                if (_newHeight > this.availableSpaceHeight)  {
                    _newHeight = this.availableSpaceHeight;
                }
            } else if (imageHeight <= this.MIN_SIZE) {
                _newHeight = this.MIN_SIZE;
            } else {
                if ((imageHeight + 76) > this.availableSpaceHeight)  {
                    _newHeight = this.availableSpaceHeight
                } else if (imageWidth < this.MIN_SIZE) {
                    _newHeight = this.MIN_SIZE;
                } else {
                    _newHeight = imageHeight + 76;
                }
            }

            // update latest width and height
            if (_newWidth > this.lastMaxWidth) {
                this.lastMaxWidth = _newWidth;
            }
            _newWidth = this.lastMaxWidth;

            if (_newHeight > this.lastMaxHeight) {
                this.lastMaxHeight = _newHeight;
            }
            _newHeight = this.lastMaxHeight;

            this._bodyElement.width(_newWidth);
            this._bodyElement.height(_newHeight)
            this._updateGalleryInfo(data);
            this._temporalImage.unbind('load');

            imageWidth = imageHeight = h = _newWidth = _newHeight = _aspectRatio = null;
        },

        /**
         * Updates the elements of the gallery with the new gallery's data.
         * @method _updateGalleryInfo <private> [Function]
         * @return this [BackstoryGalleryOverlay]
         */
        _updateGalleryInfo : function _updateGalleryInfo(data) {
            data.image && this._imageElement.attr('src', data.image).show();
            data.caption && this._shotCaptionElement.text(data.caption).show();
            this._infoBodyScrollableElement.height(this._bodyElement[0].getBoundingClientRect().height - this._headerElement[0].offsetHeight - 30);
            this._infoBodyScrollAPI.reinitialise();
            this._sourcesLinkElement.show();

            return this;
        },

        _keyUpHandler : function _keyUpHandler(ev) {
            if (ev.keyCode == 27) { /* ESC */
                return this.deactivate();
            }

            if (ev.keyCode == 37) { /* prev */
                return window.CV.backstoryUIComponent.loadPreviousGallery();
            }

            if (ev.keyCode == 39) { /* next */
                return window.CV.backstoryUIComponent.loadNextGallery();
            }
        },

        _resetVars : function _resetVars() {
            this.lastMaxWidth = 0;
            this.lastMaxHeight = 0;
            this._bodyElement.css({height: '', width: ''});
            this._infoBodyScrollableElement.css({height: this.MIN_SIZE});

            return this;
        },

        _activate : function _activate() {
            Widget.prototype._activate.call(this);

            this._resetVars();

            this._document.bind('keydown.bg', function(ev) {
                ev.preventDefault();
            });

            this._document.bind('keyup.bg', this._keyUpHandler.bind(this));
        },

        _deactivate : function _deactivate() {
            Widget.prototype._deactivate.call(this);

            this._document.unbind('keyup.bg');
            this._document.unbind('keydown.bg');
            this._sourcesElement.removeClass('active');
            this._iframeElement.attr('src', '');
        }
    }
});
