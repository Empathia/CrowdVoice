Class(CV, 'BackstoryGalleryOverlay').inherits(Widget)({
    HTML : '\
    <div class="cv-backstory-overlay">\
    <div class="cv-backstory-overlay-arrow left">\
      <span class="lines"></span>\
      <i class="icon-arrow-left-light"></i>\
    </div>\
    <div class="cv-backstory-overlay-arrow right">\
      <span class="lines"></span>\
      <i class="icon-arrow-right-light"></i>\
    </div>\
      <div class="cv-backstory-overlay__wrapper">\
        <div class="cv-backstory-overlay__inner">\
          <div class="cv-backstory-overlay__body clearfix">\
            <div class="cv-backstory-overlay__gallery cv-pull-left">\
              <div class="cv-backstory-overlay__shot">\
                <div class="cv-backstory-overlay__shot-image">\
                  <img />\
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
              <div class="cv-backstory-overlay__gallery-nav">\
                <div class="cv-backstory-overlay__thumbs">\
                </div>\
                <div class="cv-backstory-overlay__arrows">\
                  <a href="#" class="cv-button">\
                    <i class="mediafeed-sprite left-arrow"></i>\
                  </a>\
                  <a href="#" class="cv-button">\
                    <i class="mediafeed-sprite right-arrow"></i>\
                  </a>\
                </div>\
              </div>\
            </div>\
            <div class="cv-backstory-overlay__info cv-pull-right">\
              <div class="cv-backstory-overlay__info-header">\
                <a href="#" alt="close" class="close-icon icon-x cv-dynamic-hover-text-color"></a>\
                <p class="cv-backstory-overlay__info-date">{{May 15, 2014}}</p>\
                <p class="cv-backstory-overlay__info-title">{{title}}</p>\
              </div>\
              <div class="cv-backstory-overlay__info-body">\
                <div class="cv-backstory-overlay__info-body-inner">\
                  <p class="cv-backstory-overlay__info-description">{{description}}</p>\
                  <p>\
                    <a class="cv-backstory-overlay__info-suggest-correction" href="#" target="_blank">Suggest a Correction</a>\
                  </p>\
                </div>\
                <a href="#" class="cv-backstory-overlay__sources-link cv-dynamic-text-color">Sources ›</a>\
                <div class="cv-backstory-overlay__sources">\
                  <a href="#" class="cv-backstory-overlay__sources-close cv-dynamic-text-color">Close ›</a>\
                  <ul class="sources">\
                  </ul>\
                </div>\
              </div>\
            </div>\
          </div>\
        </div>\
      </div>\
    ',
    SUGGESTION_MAILTO: 'mailto:crowdvoice@mideastyouth.com?subject=I%20have%20a%20correction&body=I\'d%20like%20to%20suggest%20a%20correction%20for%20the%20topic%20',

    prototype : {
        _document : null,
        _window : null,

        init : function init(config) {
            Widget.prototype.init.call(this, config);
            console.log('timeline gallery overlay');

            this._document = $(document);
            this._bodyElement = this.element.find('.cv-backstory-overlay__body');
            this._shotElement = this.element.find('.cv-backstory-overlay__shot');
            this._imageElement = this.element.find('.cv-backstory-overlay__shot-image > img');
            this._shotCaptionElement = this.element.find('.cv-backstory-overlay__shot-caption');
            this._warningMessage = this.element.find('.cv-backstory-overlay__warning-message');
            this._warningButtonView = this.element.find('.cv-backstory-overlay__warning-button-show');
            this._thumbsWrapperElement = this.element.find('.cv-backstory-overlay__thumbs');
            this._headerElement = this.element.find('.cv-backstory-overlay__info-header');
            this._infoBodyElement = this.element.find('.cv-backstory-overlay__info-body');
            this._closeElement = this.element.find('.cv-backstory-overlay__info-header > .close-icon');
            this._dateElement = this.element.find('.cv-backstory-overlay__info-date');
            this._titleElement = this.element.find('.cv-backstory-overlay__info-title');
            this._descriptionElement = this.element.find('.cv-backstory-overlay__info-description');
            this._suggestCorrectionElement = this.element.find('.cv-backstory-overlay__info-suggest-correction');
            this._sourcesLinkElement = this.element.find('.cv-backstory-overlay__sources-link');
            this._sourcesElement = this.element.find('.cv-backstory-overlay__sources');
            this._sourcesElementList = this._sourcesElement.find('ul');
            this._sourceCloseButton = this._sourcesElement.find('.cv-backstory-overlay__sources-close');
            this._prevArrow = this.element.find('.cv-backstory-overlay-arrow.left');
            this._nextArrow = this.element.find('.cv-backstory-overlay-arrow.right');

            this._bindEvents();
        },

        _bindEvents : function _bindEvents() {
            this._closeElement.bind('click', function(ev) {
                ev.preventDefault();
                this.deactivate();
            }.bind(this));

            this._prevArrow.bind('click', function() {
                window.CV.backstoryUIComponent.loadPreviousGallery();
            });

            this._nextArrow.bind('click', function() {
                window.CV.backstoryUIComponent.loadNextGallery();
            });

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
            this._suggestCorrectionElement.attr('src', this.constructor.SUGGESTION_MAILTO + data.name);

            if (this.carrousel) {
                this.carrousel.destroy();
            }
            this.appendChild(new CV.BackstoryGalleryCarrousel({
                name : 'carrousel'
            })).addThumbs(data.images).render(this._thumbsWrapperElement);

            this.carrousel.activateFirst();
            /*
             * TODO: grab screenshot from youtube
            */

            this._sourcesElementList.empty();
            data.sources.forEach(function(source)  {
                this._sourcesElementList.append(
                    $('<li class="source"><a href="' + source.url + '" target="_blank">' + source.label + '</a></li>')
                )
            }, this);

            year = month = day = date = null;
        },

        W : null,
        H : null,
        ASW : null,
        ASH : null,
        MD : 520,
        LW : 0,
        LH : 0,
        arrowsWidth : (84 * 2),
        _imgTmp : null,
        _$imgTmp : null,

        updateImage : function updateImage(data)  {
            this._imageElement.hide();
            this._shotCaptionElement.hide();

            if (data.is_explicit) {
                this._warningMessage.show();
            } else {
                this._warningMessage.hide();
            }

            this._imgTmp = new Image();
            this._imgTmp.src = data.image;
            this._$imgTmp = $(this._imgTmp);

            this.W = window.innerWidth
            this.H = window.innerHeight
            this.ASW = (this.W - (this.arrowsWidth))
            this.ASH = (this.H - (40))

            this._$imgTmp.unbind('load').bind('load', this._imageLoadHandler.bind(this, data));
        },

        _imageLoadHandler : function _imageLoadHandler(data, ev) {
            var iw = ev.currentTarget.naturalWidth,
                ih = ev.currentTarget.naturalHeight,
                h = iw > ih,
                _w, _h, _as;

            //if (h) {
                if ((iw + 310) > this.ASW)  {
                    _w = this.ASW;
                    _as = Math.min(iw / (this.ASW - 310))
                //} else if (iw < this.MD) {
                //    _w = this.MD;
                } else {
                    _w = iw + 310;
                }

                //if (_w > this.LW) {
                    this.LW = _w
                    this._bodyElement.width(_w)
                    //this._shotElement.width(_w)
                    //this._imageElement.width(_w).height('auto')
                //}
            //} else {

            if (_as) {
                _h = ~~((ih / _as) + 76)
            } else {
                if ((ih + 76) > this.ASH)  {
                    _h = this.ASH
                //} else if (iw < this.MD) {
                //    _h = this.MD
                } else {
                    _h = ih + 76
                }
            }
                //if (_h > this.LH) {
                    this.LH = _h
                    this._bodyElement.height(_h)
                    //this._shotElement.height(_h)
                    //this._imageElement.height(_h).width('auto')
                //}
            //}

            this._shotCaptionElement.text(data.caption).show();
            this._imageElement.attr('src', data.image).show();
            this._infoBodyElement.height(_h - this._headerElement.outerHeight());

            this._$imgTmp.unbind('load');
        },

        _resetVars : function _resetVars() {
            this.LW = 0;
            this.LH = 0;
            this._shotElement.css({height: '', width: ''})
            this._imageElement.css({height: '', width: ''})
        },

        _keyUpHandler : function _keyUpHandler(ev) {
            if (ev.keyCode == 27) {
                return this.deactivate();
            }

            if (ev.keyCode == 37) {
                return window.CV.backstoryUIComponent.loadPreviousGallery();
            }

            if (ev.keyCode == 39) {
                return window.CV.backstoryUIComponent.loadNextGallery();
            }
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
        }
    }
});
