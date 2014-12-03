Class(CV, 'Map').inherits(Widget)({
    HTML : '\
        <div class="map-overlay">\
            <div class="js-voice-map">\
                <div class="loader loader--dark loader--show">\
                    <span class="loader__inner">\
                        <span class="loader__image"></span>\
                    </span>\
                </div>\
            </div>\
        </div>\
    ',

    _geocoder : null,

    geocoder : function geocoder() {
        this._geocoder = this._geocoder || new google.maps.Geocoder();
        return this._geocoder;
    },

    geocode : function geocode(address, callback) {
        this.geocoder().geocode({ address: address }, function (results, statusResponse) {
            if(statusResponse == 'OK' && !results[0].partial_match) {
                callback(results[0].geometry.location);
            }
        });
    },

    at : function at(latitude, longitude) {
        return new google.maps.LatLng(latitude, longitude);
    },

    /**
     * Fetch and returns the data from locations.json.
     * @method getLocations <public> [Function]
     * @argument callback <required> [Function]
     * @return this [CV.Map]
     */
    getLocations : function getLocations(callback) {
        $.getJSON('/locations.json', function (data) {
            this.voices_locations = data;
            callback(data);
        }.bind(this));
    },

    /* 
     * Inyects GoogleMaps script.
     * @method inyectGoogleMapsScript <public> [Function]
     * @argument callback <optional> [Function] function to be run after the
     * script is inyected.
     * @return this [CV.Map]
     */
    inyectGoogleMapsScript : function inyectGoogleMapsScript(callback) {
        var script = document.createElement('script');
        script.src = "https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false";

        if (callback) {
            script.src += "&callback=" + callback;
        }

        document.getElementsByTagName('head')[0].appendChild(script);
        this.isGoogleScriptInyected = true;

        return this;
    },

    isGoogleScriptInyected : false,
    _markerLabelAdded : false,

    prototype: {
        /**
         * Map instance holder.
         * @property _map <private> [Object]
         */
        _map : null,
        _infowindows : [],

        /** 
         * Google Map Options 
         */
        zoom : 2,
        mapTypeControlOptions : {
            mapTypeIds : ['map_style']
        },
        mapTypeId : 'map_style',
        scrollwheel : true,
        center : null,

        init : function init (config) {
            Widget.prototype.init.call(this, config);

            this.element[0].style.backgroundColor = '#2A2B2C';
        },
        
        /**
         * Create the map using google maps API.
         * @method createMap <public> [Function]
         * @return this [CV.Map]
         */ 
        createMap : function createMap() {
            if (this.constructor._markerLabelAdded === false) {
                CV.AddGoogleMapsMarkers();
                this.constructor._markerLabelAdded = true;
            }

            this._map = new google.maps.Map(this.element[0], {
                zoom : this.zoom,
                mapTypeControlOptions : this.mapTypeControlOptions,
                mapTypeId : this.mapTypeId,
                scrollwheel : this.scrollwheel,
                center : this.center
            });

            this._bindEvents();
            this._applyMapStyles();

            return this;
        }, 

        _bindEvents : function _bindEvents() {
            google.maps.event.addListener(this._map, 'bounds_changed', function boundsChanged() {
                google.maps.event.trigger(this._map, 'resize');
            }.bind(this));

            return this;
        },

        _applyMapStyles : function _applyMapStyles() {
            var styledMap, styles;

            styles = [
                {
                    "stylers": [
                        { "hue": "#0077ff" },
                        { "saturation": -95 },
                        { "lightness": -68 }
                    ]
                }, {
                    "featureType": "water",
                    "stylers": [
                        { "hue": "#00bbff" },
                        { "lightness": -30 }
                    ]
                },{
                    "elementType": "labels.text.fill",
                    "stylers": [
                        { "lightness": 40 }
                    ]
                },{
                    "elementType": "labels.text.stroke",
                    "stylers": [
                        { "lightness": -50 }
                    ]
                },{
                }
            ];
            styledMap = new google.maps.StyledMapType(styles, {name: "Map"});

            this._map.mapTypes.set('map_style', styledMap);
            this._map.setMapTypeId('map_style');

            return this;
        },

        /**
         * Sets the center point of the map.
         * @method setMapCenter <public> [Function]
         * @argument lat <required> [Number] The latitud.
         * @argument lon <required> [Number] The longitud.
         * @return this [CV.Map]
         */
        setMapCenter : function setMapCenter(lat, lon) {
            this.center = this.constructor.at(lat, lon);
        
            return this;
        },

        addPin : function addPin(position, title, label, content) {
            var marker = this.createMarker(position, title),
                label = this.createLabel(label),
                infowindow = this.createInfoWindow(content);

            label.bindTo('position', marker, 'position');

            google.maps.event.addListener(marker, 'click', function () {
                this.closeAllInfowindows();
                infowindow.open(this._map, marker);
            }.bind(this));

            return this;
        },

        closeAllInfowindows : function closeAllInfowindows() {
            for (var i = 0; i < this._infowindows.length; i++) {
                this._infowindows[i].close();
            }

            return this;
        },

        createInfoWindow : function createInfoWindow(content) {
            var infowindow = new google.maps.InfoWindow({ content: content, maxWidth: 400 });

            this._infowindows.push(infowindow);

            return infowindow;
        },

        createMarker : function createMarker(position, title) {
            return new google.maps.Marker({
                icon : '/images/pin.png',
                map : this._map,
                position : position,
                title : title
            });
        },

        createLabel : function createLabel(text) {
            return new MarkerLabel({ 
                map : this._map, 
                label : text 
            });
        }
    }
});

/*
 * MarkerLabel is an extension to marker to add a dynamic label
 */
 CV.AddGoogleMapsMarkers = function() {
    window.MarkerLabel = function(opt_options) {
        this.setValues(opt_options);
        var span = this.span_ = document.createElement('span');
        span.style.cssText = 'position: relative; font-size: 10px; left: -50%; top: -42px; z-index:900; white-space: nowrap; padding: 2px; color: white;';
        var div = this.div_ = document.createElement('div');
        div.appendChild(span);
        div.style.cssText = 'position: absolute; display: none;';
    }

    MarkerLabel.prototype = new google.maps.OverlayView;

    MarkerLabel.prototype.onAdd = function() {
        var pane = this.getPanes().overlayImage;
        pane.appendChild(this.div_);
        var me = this;
        this.listeners_ = [
            google.maps.event.addListener(this, 'position_changed', function() { me.draw(); }),
            google.maps.event.addListener(this, 'text_changed', function() { me.draw(); })
        ];
    };

    MarkerLabel.prototype.onRemove = function() {
        this.div_.parentNode.removeChild(this.div_);
        for(var i = 0; i < this.listeners_.length; i++) {
            google.maps.event.removeListener(this.listeners_[i]);
        }
    };

    MarkerLabel.prototype.draw = function() {
        var projection = this.getProjection();
        var position = projection.fromLatLngToDivPixel(this.get('position'));
        var div = this.div_;
        div.style.left = position.x + 'px';
        div.style.top = position.y + 'px';
        div.style.display = 'block';
        this.span_.innerHTML = this.get('label');
    };
}