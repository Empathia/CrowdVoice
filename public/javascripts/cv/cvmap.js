Class('CVMap')({

    geocoder: function() {
        this._geocoder = this._geocoder || new google.maps.Geocoder();
        return this._geocoder;
    },

    at: function(latitude, longitude) {
        return new google.maps.LatLng(latitude, longitude);
    },

    geocode: function (address, callback) {
        this.geocoder().geocode({ address: address }, function (results, statusResponse) {
            if(statusResponse == 'OK' && !results[0].partial_match) {
                callback(results[0].geometry.location);
            }
        });
    },

    getLocations: function (callback) {
        var that = this;
        $.getJSON('/locations.json', function (data) {
            that.voices_locations = data;
            callback(data);
        });
    },

    prototype: {
        init: function(element, options) {
            this.options = {
                zoom: 2,
                mapTypeControlOptions: {
                    mapTypeIds: ['map_style']
                },
                mapTypeId: 'map_style',
                scrollwheel: true,
                center: this.constructor.at(0, 0)
            };
            $.extend(this.options, options);
            this.element = typeof element == 'string' ? $(element) : element;
            this._map = new google.maps.Map(this.element[0], this.options);
            this.applyMapStyles();
            this._infowindows = [];

            this.bindEvents();
        },

        bindEvents : function() {
            var map = this._map;
            google.maps.event.addListener( map, 'bounds_changed', function boundsChanged() {
                google.maps.event.trigger(map, 'resize');
            });

            return this;
        },

        applyMapStyles: function () {
            var styledMap,
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
            this.element.css('backgroundColor', '#2A2B2C');
        },

        addPin: function(position, title, label, content) {
            var marker = this.createMarker(position, title),
                label = this.createLabel(label),
                that = this,
                infowindow = this.createInfoWindow(content);

            label.bindTo('position', marker, 'position');
            google.maps.event.addListener(marker, 'click', function () {
                that.closeAllInfowindows();
                infowindow.open(that._map, marker);
            });
        },

        closeAllInfowindows: function() {
            for (var i = 0; i < this._infowindows.length; i++) {
                this._infowindows[i].close();
            }
        },

        createInfoWindow: function (content) {
            var infowindow = new google.maps.InfoWindow({ content: content, maxWidth: 400 });
            this._infowindows.push(infowindow);
            return infowindow;
        },

        createMarker: function(position, title) {
            return new google.maps.Marker({
                icon: '/images/pin.png',
                map: this._map,
                position: position,
                title: title
            });
        },

        createLabel: function (text) {
            return new MarkerLabel({ map: this._map, label: text });
        }
    }
});

/*
 * MarkerLabel is an extension to marker to add a dynamic label
 *
 */
function MarkerLabel(opt_options) {
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
