Class(CV, 'MainMap').inherits(Widget).includes(CV.MainMapHelper)({
    HTML : '\
    <div>\
        <div class="map-container__header clearfix">\
            <div class="cv-pull-left">\
                <p class="map-container__header-title cv-uppercase">Voices on the map</p>\
            </div>\
            <div class="cv-pull-right map-container__header-filters">\
                <span class="map-container__header-filters-title">Filter Voices by:</span>\
                <div class="map-container__filter-region cv-inline-block">\
                  <button class="cv-button cv-button--small cv-uppercase with-arrow">Region <i class="cv-button--arrow"></i></button>\
                </div>\
                <div class="map-container__filter-theme cv-inline-block">\
                  <button class="cv-button cv-button--small cv-uppercase with-arrow">Theme <i class="cv-button--arrow"></i></button>\
                </div>\
                <div class="map-container__filter-features cv-inline-block">\
                  <button class="cv-button cv-button--small cv-uppercase with-arrow">Features <i class="cv-button--arrow"></i></button>\
                </div>\
            </div>\
            <div class="map-container__header-rainbow"></div>\
        </div>\
        <div class="loader loader--dark loader--show">\
          <span class="loader__inner">\
            <span class="loader__image"></span>\
          </span>\
        </div>\
    </div>\
    ',

    ELEMENT_CLASS : 'main-map-widget',

    initializeVoicesMap : function initializeVoicesMap() {
        this.dispatch('googleMapsScriptInyected');
    },

    prototype : {
        /**
         * Data holder cache. Provide the data to create the map's markers.
         * @property _locations <private> [Array]
         */
        _locations : [],
        _cluster : null,
        _polylines : {},
        _created : false,

        _regionFilterSelectedOptions : [],
        _featuresFilterExpression : [],

        _regionsWrapper : null,
        _regionsButton : null,
        _regionsTooltip : null,
        _filterRegionElements : null,
        _featuresWrapper : null,
        _featuresButton : null,
        _featuresTooltip : null,
        _filterFeaturesElements : null,

        init : function init (config) {
            Widget.prototype.init.call(this, config);

            this._regionsWrapper = this.element.find('.map-container__filter-region');
            this._regionsButton = this._regionsWrapper.find('.cv-button');
            this._regionsTooltip = new CV.Tooltip({
                html : '\
                    <label><input type="checkbox" name="map-filter__region" value="all" checked disabled> All</label>\
                    <label><input type="checkbox" name="map-filter__region" value="northAmerica" checked> North America <span></span></label>\
                    <label><input type="checkbox" name="map-filter__region" value="southAmerica" checked> South America <span></span></label>\
                    <label><input type="checkbox" name="map-filter__region" value="europe" checked> Europe <span></span></label>\
                    <label><input type="checkbox" name="map-filter__region" value="middleEast" checked> Middle East <span></span></label>\
                    <label><input type="checkbox" name="map-filter__region" value="asia" checked> Asia <span></span></label>\
                    <label><input type="checkbox" name="map-filter__region" value="africa" checked> Africa <span></span></label>\
                    <label><input type="checkbox" name="map-filter__region" value="oceania" checked> Oceania <span></span></label>\
                ',
                position : 'bottom',
                showOnCssHover : false
            }).render(this._regionsWrapper);
            this._filterRegionElements = this._regionsWrapper.find('input');

            this._featuresWrapper = this.element.find('.map-container__filter-features');
            this._featuresButton = this._featuresWrapper.find('.cv-button');
            this._featuresTooltip = new CV.Tooltip({
                html : '\
                    <label><input type="checkbox" name="map-filter__features" value="mediafeed" checked> Mediafeed <span></span></label>\
                    <label><input type="checkbox" name="map-filter__features" value="backstories" checked> Backstories <span></span></label>\
                    <label><input type="checkbox" name="map-filter__features" value="infographic" checked> Infographics <span></span></label>\
                ',
                position : 'bottom',
                showOnCssHover : false
            }).render(this._featuresWrapper);
            this._filterFeaturesElements = this.element.find('[name="map-filter__features"]');

            this.appendChild(new CV.Map({
                name : 'mapWidget',
                zoom : 2
            })).render(this.element);

            this._updateSelectedRegionOptions();
            this._updateFeaturesExpression();

            this._bindEvents();
        },

        _bindEvents : function _bindEvents() {
            this.constructor.bind('googleMapsScriptInyected', function () {
                var mainMap = this;

                CV.Map.inyectMapClusterScript();
                mainMap.mapWidget.setMapCenter(0, 0).createMap();
                mainMap._createContinentPolygons();
                mainMap._created = true;

                CV.Map.getLocations(function (locations) {
                    mainMap._locations = locations;
                    mainMap._cluster = mainMap.mapWidget.getNewCluster();

                    mainMap._addCounterToRegionOptions(mainMap._locations);
                    mainMap._addCounterToFeaturesOptions(mainMap._locations);
                    mainMap.updateMap(mainMap._locations);
                });
            }.bind(this));

            this._regionsButton.bind('click', function(ev) {
                this._featuresTooltip.deactivate();
                this._featuresButton.removeClass('active');

                if (this._regionsTooltip.active) {
                    this._regionsButton.removeClass('active');
                    this._regionsTooltip.deactivate();
                } else {
                    this._regionsButton.addClass('active');
                    this._regionsTooltip.activate();
                }
            }.bind(this));

            this._featuresButton.bind('click', function(ev) {
                this._regionsTooltip.deactivate();
                this._regionsButton.removeClass('active');

                if (this._featuresTooltip.active) {
                    this._featuresButton.removeClass('active');
                    this._featuresTooltip.deactivate();
                } else {
                    this._featuresButton.addClass('active');
                    this._featuresTooltip.activate();
                }
            }.bind(this));

            this._filterRegionElements.bind('click', this._filterRegionClickHandler.bind(this));
            this._filterFeaturesElements.bind('click', this._filterFeaturesClickHandler.bind(this));

            return this;
        },

        _filterRegionClickHandler : function _filterRegionClickHandler(ev) {
            var allOption;

            var allDeselected = true;
            this._filterRegionElements.each(function(i, el) {
                if (el.checked === true) {
                    allDeselected = false;
                    return false;
                }
            });

            if (allDeselected) {
                ev.currentTarget.checked = false;
                return false;
            }

            if (ev.currentTarget.value === "all") {
                allOption = ev.currentTarget;

                if (allOption.checked) {
                    this._filterRegionElements.filter(function(i, opt) {
                        return opt.value !== "all";
                    }).each(function(i, opt) { opt.checked = true; });

                    allOption.setAttribute('disabled', true);
                }
            } else {
                allOption = this._filterRegionElements.filter(function(i, opt) { return opt.value === "all"; })[0];

                if (ev.currentTarget.checked) {
                    var areAllChecked = true;

                    this._filterRegionElements.filter(function(i, opt) {
                        return opt.value !== "all";
                    }).each(function(i, opt) {
                        if (opt.checked === false) {
                            areAllChecked = false;
                            return false;
                        }
                    });
                } else areAllChecked = false;

                allOption.checked = areAllChecked;
                if (areAllChecked) allOption.setAttribute('disabled', true);
                else allOption.removeAttribute('disabled');
            }

            this._updateSelectedRegionOptions();
            this.filter();
        },

        _filterFeaturesClickHandler : function _filterFeaturesClickHandler(ev) {
            var allDeselected = true;
            this._filterFeaturesElements.each(function(i, el) {
                if (el.checked === true) {
                    allDeselected = false;
                    return false;
                }
            });

            if (allDeselected) {
                ev.currentTarget.checked = false;
                return false;
            }

            this._updateFeaturesExpression();
            this.filter();
        },

        _updateSelectedRegionOptions : function _updateSelectedRegionOptions() {
            var mainMap = this;

            this._regionFilterSelectedOptions = [];

            this._filterRegionElements.filter(':checked').each(function(i, opt) {
                if (opt.value !== "all") {
                    mainMap._regionFilterSelectedOptions.push(opt.value);
                }
            });

            return this;
        },

        _updateFeaturesExpression : function _updateFeaturesExpression() {
            var mainMap = this;
            this._featuresFilterExpression = [];

            this._filterFeaturesElements.filter(':checked').each(function(i, opt) {
                if (opt.value === "mediafeed") {
                    mainMap._featuresFilterExpression.push("(!v.is_backstory && !v.is_infographic)");
                }

                if (opt.value === "infographic") {
                    mainMap._featuresFilterExpression.push("(v.is_infographic)");
                }

                if (opt.value === "backstories") {
                    mainMap._featuresFilterExpression.push("(v.is_backstory)");
                }
            });

            this._featuresFilterExpression = this._featuresFilterExpression.join("||");

            return this;
        },

        _getFilteredResultsByRegion : function _getFilteredResultsByRegion() {
            var mainMap, locations;

            mainMap = this;
            locations = JSON.parse(JSON.stringify(mainMap._locations));

            return locations.filter(function(l) {
                var voices = l.voices.filter(function(v) {
                    var latLng = new google.maps.LatLng(v.latitude, v.longitude);
                    return mainMap._regionFilterSelectedOptions.some(function(option) {
                        return (google.maps.geometry.poly.containsLocation(latLng, mainMap._polylines[option]));
                    });
                });

                if (voices.length) {
                    return l.voices = voices;
                }
            });
        },

        _getFilteredResultsByFeature : function _getFilteredResultsByFeature(data) {
            var mainMap = this;

            return data.filter(function(l) {
                var voices = l.voices.filter(function(v) {
                    return eval(mainMap._featuresFilterExpression);
                });

                if (voices.length) {
                    return l.voices = voices;
                }
            });
        },

        filter : function filter () {
            var r = this._getFilteredResultsByRegion();
            r = this._getFilteredResultsByFeature(r);

            this.updateMap(r);

            return this;
        },

        updateMap : function updateMap(locations) {
            var markers, i, l;

            markers = [];
            l = locations.length;

            for (i = 0; i < l; i++) {
                var loc = locations[i].location,
                    position = null,
                    label = locations[i].voices.length,
                    title = label + ' voice(s) in ' + loc,
                    content = '<ul class="map-voices">',
                    theme;

                for (var j = 0; j < label; j++) {
                    var voice = locations[i].voices[j];
                    theme = voice.theme;

                    if (!position) {
                        position = CV.Map.at(voice.latitude, voice.longitude);
                    }

                    content += '<li><a href="/' + voice.default_slug + '">' + voice.title + '</a></li>';
                }

                content += '</ul>';

                markers.push(this.mapWidget.addMarker(position, title, label, content, theme));
            }

            this._cluster.clearMarkers();
            this._cluster.addMarkers(markers);

            return this;
        },

        _addCounterToRegionOptions : function _addCounterToRegionOptions(locations) {
            var na, sa, eu, me, as, af, oc;

            na = sa = eu = me = as = af = oc = 0;

            locations.forEach(function(l) {
                l.voices.forEach(function(v) {
                    var latLng = new google.maps.LatLng(v.latitude, v.longitude);
                    if (google.maps.geometry.poly.containsLocation(latLng, mainMap._polylines["northAmerica"])) na++;
                    if (google.maps.geometry.poly.containsLocation(latLng, mainMap._polylines["southAmerica"])) sa++;
                    if (google.maps.geometry.poly.containsLocation(latLng, mainMap._polylines["europe"])) eu++;
                    if (google.maps.geometry.poly.containsLocation(latLng, mainMap._polylines["middleEast"])) me++;
                    if (google.maps.geometry.poly.containsLocation(latLng, mainMap._polylines["asia"])) as++;
                    if (google.maps.geometry.poly.containsLocation(latLng, mainMap._polylines["africa"])) af++;
                    if (google.maps.geometry.poly.containsLocation(latLng, mainMap._polylines["oceania"])) oc++;
                });
            });

            this._filterRegionElements.filter("[value='northAmerica']").siblings('span').text('(' + na + ')');
            this._filterRegionElements.filter("[value='southAmerica']").siblings('span').text('(' + sa + ')');
            this._filterRegionElements.filter("[value='europe']").siblings('span').text('(' + eu + ')');
            this._filterRegionElements.filter("[value='middleEast']").siblings('span').text('(' + me + ')');
            this._filterRegionElements.filter("[value='asia']").siblings('span').text('(' + as + ')');
            this._filterRegionElements.filter("[value='africa']").siblings('span').text('(' + af + ')');
            this._filterRegionElements.filter("[value='oceania']").siblings('span').text('(' + oc + ')');

            return this;
        },

        _addCounterToFeaturesOptions : function _addCounterToFeaturesOptions(locations) {
            var mediafeeds, backstories, infographics;

            mediafeeds = backstories = infographics = 0;

            locations.forEach(function(l) {
                l.voices.forEach(function(v) {
                    if (!v.is_backstory && !v.is_infographic) mediafeeds++;
                    if (v.is_infographic) infographics++;
                    if (v.is_backstory) backstories++;
                });
            });

            this._filterFeaturesElements.filter("[value='mediafeed']").siblings('span').text('(' + mediafeeds + ')');
            this._filterFeaturesElements.filter("[value='backstories']").siblings('span').text('(' + backstories + ')');
            this._filterFeaturesElements.filter("[value='infographic']").siblings('span').text('(' + infographics + ')');

            return this;
        },

        _createContinentPolygons : function _createContinentPolygons() {
            this._polylines['northAmerica'] = new google.maps.Polygon({
                path : this.getNorthAmericaPaths(),
                fillOpacity : 0.0,
                strokeOpacity : 0.0
            });

            this._polylines['southAmerica'] = new google.maps.Polygon({
                path : this.getSoutAmericaPaths(),
                fillOpacity : 0.0,
                strokeOpacity : 0.0
            });

            this._polylines['europe'] = new google.maps.Polygon({
                path : this.getEuropePaths(),
                fillOpacity : 0.0,
                strokeOpacity : 0.0
            });

            this._polylines['middleEast'] = new google.maps.Polygon({
                path : this.getMiddleEastPaths(),
                fillOpacity : 0.0,
                strokeOpacity : 0.0
            });

            this._polylines['asia'] = new google.maps.Polygon({
                path : this.getAsiaPaths(),
                fillOpacity : 0.0,
                strokeOpacity : 0.0,
            });

            this._polylines['oceania'] = new google.maps.Polygon({
                path : this.getOceaniaPaths(),
                fillOpacity : 0.0,
                strokeOpacity : 0.0
            });

            this._polylines['africa'] = new google.maps.Polygon({
                path : this.getAfricaPaths(),
                fillOpacity : 0.0,
                strokeOpacity : 0.0
            });

            this._polylines.northAmerica.setMap(this.mapWidget._map);
            this._polylines.southAmerica.setMap(this.mapWidget._map);
            this._polylines.europe.setMap(this.mapWidget._map);
            this._polylines.middleEast.setMap(this.mapWidget._map);
            this._polylines.asia.setMap(this.mapWidget._map);
            this._polylines.oceania.setMap(this.mapWidget._map);
            this._polylines.africa.setMap(this.mapWidget._map);

            return this;
        },

        _activate : function _activate () {
            Widget.prototype._activate.call(this);
            this.mapWidget.activate();

            /* check for google maps dependencies */
            if (CV.Map.isGoogleScriptInyected === false) {
                CV.Map.inyectGoogleMapsScript("CV.MainMap.initializeVoicesMap");
            } else if (this._created === false) {
                CV.MainMap.initializeVoicesMap();
            }
        },

        _deactivate : function _deactivate() {
            Widget.prototype._deactivate.call(this);

            this.mapWidget.deactivate();
        }
    }
});

