Class(CV, 'VoiceHeaderNav').inherits(Widget)({
    _mapElementWrapper : null,
    _mapLat : 0,
    _mapLng : 0,
    _mapButtonElement : null,
    _voiceMapCreated : false,
    _mainContainer : null,
    voiceMapWidget : null,
    voiceDescriptionTooltip : null,

    prototype : {
        init : function(config) {
            Widget.prototype.init.call(this, config);

            this._mapElementWrapper = this.element.find('.voice-map-wrapper');
            this._mapButtonElement = this.element.find('.info-tool-link.map');
            this._mapLat = this._mapElementWrapper.data('lat');
            this._mapLng = this._mapElementWrapper.data('lng');
            this._mainContainer = $('.main-container');

            this._setupWidgets()._bindEvents();
        },

        _setupWidgets : function _setupWidgets() {
            var voiceHeaderNav = this;

            /* Global Google Maps Callback Function */
            window.addCoordsToMap = function addCoordsToMap() {
                this._voiceMapCreated = true;
                this.voiceMapWidget.setMapCenter(this._mapLat, this._mapLng).createMap();
            }.bind(this);

            this.voiceMapWidget = new CV.Map({
                zoom : 8
            }).render(this._mapElementWrapper);

            this.voiceDescriptionTooltip = new CV.Tooltip({
                element : this.element.find('.voice-description-tooltip'),
                toggler: this.element.find('.description-wrapper'),
                showOnCssHover : false,
                enterTogglerElementEvent : this._tooltipMouseEnterHandler.bind(this),
                leaveTogglerElementEvent : this._tooltipMouseLeaveHandler.bind(this)
            });


            this.blogWidget = new BlogWidget();

            this.embeddableTooltip = new CV.Tooltip({
                element: $('.embeddable-widget-tooltip'),
                showOnCssHover : false,
                clickHandler : function(ev) {
                    if (this.active) {
                        this.deactivate();
                        voiceHeaderNav.blogWidget._copyCodeClip.glue('js-copy-code-button');
                    } else {
                        this.activate();
                        voiceHeaderNav.blogWidget._copyCodeClip.setText('');
                        voiceHeaderNav.blogWidget._copyCodeClip.setCSSEffects(true);
                        voiceHeaderNav.blogWidget._copyCodeClip.glue('js-copy-code-button');
                        voiceHeaderNav.blogWidget._updateCode();
                    }
                    return false
                },
                toggler : $('.info-tool.widget a')
            });

            return this;
        },

        _bindEvents : function _bindEvents() {
            this._mapButtonElement.bind('click', function(){
                if ($('label.tweets-label input').attr('checked')) {
                    $('label.tweets-label input').click();
                };
                if (this.voiceMapWidget.active) {
                    this._mapButtonElement.removeClass('active');
                    this._mapElementWrapper.removeClass('active');
                    this.voiceMapWidget.deactivate();
                } else {
                    this._mapButtonElement.addClass('active');
                    this._mapElementWrapper.addClass('active');
                    this.voiceMapWidget.activate();
                }

                if (CV.Map.isGoogleScriptInyected === false) {
                    CV.Map.inyectGoogleMapsScript("addCoordsToMap");
                } else if (this._voiceMapCreated === false) {
                    window.addCoordsToMap();
                }

                return false;
            }.bind(this));

            return this;
        },

        _tooltipMouseEnterHandler : function _tooltipMouseEnterHandler() {
            var tooltipElement, tooltipWidth, parentElement, parentOffsetLeft, tooltipOffsetLeft, mainContainerOffset;

            tooltipElement = this.voiceDescriptionTooltip.getElement();
            tooltipWidth = tooltipElement.width();
            parentElement = tooltipElement.parent();
            parentOffsetLeft = parentElement.offset().left;
            parentWidth = parentElement.width();
            mainContainerOffset = this._mainContainer.offset().left;

            this.voiceDescriptionTooltip.activate();

            tooltipOffsetLeft = tooltipElement.offset().left;

            if ((tooltipOffsetLeft - mainContainerOffset) < 0) {
                this.voiceDescriptionTooltip.setTooltipStyles({
                    left : (parentOffsetLeft * -1) + mainContainerOffset + 20,
                    transform : 'none'
                })

                this.voiceDescriptionTooltip.setArrowStyles({
                    'left': ((parentOffsetLeft - mainContainerOffset) - 20) + (parentWidth / 2)
                });
            }

            outScreen = (tooltipElement.offset().left + tooltipWidth) - window.innerWidth;

            if (outScreen > 0) {
                this.voiceDescriptionTooltip.setTooltipStyles({
                    width: tooltipWidth - outScreen - 20
                });
            }

            return this;
        },

        _tooltipMouseLeaveHandler : function _tooltipMouseLeaveHandler() {
            this.voiceDescriptionTooltip.deactivate();

            this.voiceDescriptionTooltip.setTooltipStyles({
                left: "",
                transform: "",
                width: ""
            });

            this.voiceDescriptionTooltip.setArrowStyles({
                'left': ""
            });

            return this;
        }
    }
});
