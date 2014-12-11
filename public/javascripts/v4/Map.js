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

    inyectMapClusterScript : function inyectMapClusterScript () {
        if (this.isMapClusterInyected === false) {
            var script = document.createElement('script');
            script.src = "http://google-maps-utility-library-v3.googlecode.com/svn/trunk/markerclusterer/src/markerclusterer.js";
            document.getElementsByTagName('head')[0].appendChild(script);
            this.isGoogleScriptInyected = true;
        }

        return this;
    },

    inyectOverlappingMarkerSpiderfier : function inyectOverlappingMarkerSpiderfier() {
        if (typeof OverlappingMarkerSpiderfier === "undefined") {
            var script = document.createElement('script');
            script.src = "/javascripts/include/oms.min.js";
            document.getElementsByTagName('head')[0].appendChild(script);
        }

        return this;
    },

    isGoogleScriptInyected : false,
    isMapClusterInyected : false,
    _markerLabelAdded : false,

    prototype: {
        /**
         * Map instance holder.
         * @property _map <private> [Object]
         */
        _map : null,
        _overlappingMarkerSpiderfier : null,
        _infowindow : null,
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

            this.element[0].style.backgroundColor = '#d3d3d3';
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
                // maxZoom : 15,
                mapTypeControlOptions : this.mapTypeControlOptions,
                mapTypeId : this.mapTypeId,
                scrollwheel : this.scrollwheel,
                center : this.center
            });

            this._bindEvents();
            this._applyMapStyles();

            return this;
        },

        spiderfy : function spiderfy() {
            this._overlappingMarkerSpiderfier = new OverlappingMarkerSpiderfier(this._map);
            this._infowindow = new google.maps.InfoWindow({maxWidth: 400});

            this._overlappingMarkerSpiderfier.addListener('click', function(marker, event) {
                this._infowindow.setContent(marker.content);
                this._infowindow.open(this._map, marker);
            }.bind(this));

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

            styles = [{"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#d3d3d3"}]},{"featureType":"transit","stylers":[{"color":"#808080"},{"visibility":"off"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"visibility":"on"},{"color":"#b3b3b3"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"road.local","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#ffffff"},{"weight":1.8}]},{"featureType":"road.local","elementType":"geometry.stroke","stylers":[{"color":"#d7d7d7"}]},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#ebebeb"}]},{"featureType":"administrative","elementType":"geometry","stylers":[{"color":"#a7a7a7"}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"landscape","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#efefef"}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"color":"#696969"}]},{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"visibility":"on"},{"color":"#737373"}]},{"featureType":"poi","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road.arterial","elementType":"geometry.stroke","stylers":[{"color":"#d6d6d6"}]},{"featureType":"road","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"color":"#dadada"}]}];
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

        addMarker : function addMarker (_position, _title, _label, _content, _theme) {
            var marker, label, infowindow, icon_image;

            icon_image = '/images/v4/google-maps/markerclusterer/ms.png';

            if (_label === 1) {
                icon_image = '/images/v4/google-maps/marker/' + _theme + '.png';
            }

            marker = new google.maps.Marker({
                map : this._map,
                position : _position,
                title : _title,
                icon : icon_image,
                // animation: google.maps.Animation.DROP,
            });
            marker.content = _content;
            this._overlappingMarkerSpiderfier.addMarker(marker);
// console.log('----------------')
            // if (_label > 1) {
            //     label = this.createLabel(_label);
            //     label.bindTo('position', marker, 'position');
            // }

            // infowindow = this.createInfoWindow(_content);

            // google.maps.event.addListener(marker, 'click', function () {
            //     this.closeAllInfowindows();
            //     infowindow.open(this._map, marker);
            // }.bind(this, marker));

            return marker;
        },

        getNewCluster : function getNewCluster () {
            var mcOptions = {
                maxZoom: 15,
                styles : [
                    {
                        textColor: '#404040',
                        width: 60,
                        height: 62,
                        url: "/images/v4/google-maps/markerclusterer/m.png"
                    },
                ]
            };

            return new MarkerClusterer(this._map, [], mcOptions);
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
                // icon : '/images/pin.png',
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
        span.style.cssText = '\
            position: relative; font-size: 11px; left: -50%; \
            top: -42px; z-index:900; white-space: nowrap; padding: 2px; color: #404040;\
            font-family: Arial, sans-serif; font-weight: bold;';
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