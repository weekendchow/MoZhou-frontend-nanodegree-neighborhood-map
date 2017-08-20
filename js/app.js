//Google map
var map;

//Initializes the Google Map object and activates Knockout
function initMap() {
    //Set up map style
    var styles = [{
            "elementType": "labels",
            "stylers": [{
                    "visibility": "off"
                },
                {
                    "color": "#f49f53"
                }
            ]
        },
        {
            "featureType": "landscape",
            "stylers": [{
                    "color": "#f9ddc5"
                },
                {
                    "lightness": -7
                }
            ]
        },
        {
            "featureType": "road",
            "stylers": [{
                    "color": "#813033"
                },
                {
                    "lightness": 43
                }
            ]
        },
        {
            "featureType": "poi.business",
            "stylers": [{
                    "color": "#645c20"
                },
                {
                    "lightness": 38
                }
            ]
        },
        {
            "featureType": "water",
            "stylers": [{
                    "color": "#1994bf"
                },
                {
                    "saturation": -69
                },
                {
                    "gamma": 0.99
                },
                {
                    "lightness": 43
                }
            ]
        },
        {
            "featureType": "road.local",
            "elementType": "geometry.fill",
            "stylers": [{
                    "color": "#f19f53"
                },
                {
                    "weight": 1.3
                },
                {
                    "visibility": "on"
                },
                {
                    "lightness": 16
                }
            ]
        },
        {
            "featureType": "poi.business"
        },
        {
            "featureType": "poi.park",
            "stylers": [{
                    "color": "#645c20"
                },
                {
                    "lightness": 39
                }
            ]
        },
        {
            "featureType": "poi.school",
            "stylers": [{
                    "color": "#a95521"
                },
                {
                    "lightness": 35
                }
            ]
        },
        {},
        {
            "featureType": "poi.medical",
            "elementType": "geometry.fill",
            "stylers": [{
                    "color": "#813033"
                },
                {
                    "lightness": 38
                },
                {
                    "visibility": "off"
                }
            ]
        },
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {
            "elementType": "labels"
        },
        {
            "featureType": "poi.sports_complex",
            "stylers": [{
                    "color": "#9e5916"
                },
                {
                    "lightness": 32
                }
            ]
        },
        {},
        {
            "featureType": "poi.government",
            "stylers": [{
                    "color": "#9e5916"
                },
                {
                    "lightness": 46
                }
            ]
        },
        {
            "featureType": "transit.station",
            "stylers": [{
                "visibility": "off"
            }]
        },
        {
            "featureType": "transit.line",
            "stylers": [{
                    "color": "#813033"
                },
                {
                    "lightness": 22
                }
            ]
        },
        {
            "featureType": "transit",
            "stylers": [{
                "lightness": 38
            }]
        },
        {
            "featureType": "road.local",
            "elementType": "geometry.stroke",
            "stylers": [{
                    "color": "#f19f53"
                },
                {
                    "lightness": -10
                }
            ]
        },
        {},
        {},
        {}
    ];

    //Create map object
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 45.416667,
            lng: -75.7
        },
        zoom: 13,
        styles: styles,
        mapTypeControl: false
    });

    //Activate Knockout
    ko.applyBindings(new MapViewModel());

}

//DataObject of each SkateboardPark
function SkateboardPark(dataObj) {
    var self = this;
    self.name = dataObj.properties.NAME;
    self.name_fr = dataObj.properties.NAME_FR;
    self.address_fr = dataObj.properties.ADDRESS_FR;
    self.address = dataObj.properties.ADDRESS;
    self.parkID = dataObj.properties.PARK_ID;
    self.notes = dataObj.properties.NOTES;
    self.latitude = parseFloat(dataObj.geometry.coordinates[1]);
    self.longitude = parseFloat(dataObj.geometry.coordinates[0]);

    //Create the map marker for SkateboardPark object
    self.mapMarker = new google.maps.Marker({
        position: {
            lat: self.latitude,
            lng: self.longitude
        },
        map: map,
        title: self.name,
        animation: google.maps.Animation.DROP,
    });

    //Create the infoWindow for SkateboardPark object
    self.infoWindow = new google.maps.InfoWindow();

    //Function that populate the infoWindow
    self.populateInfoWindow = function() {
        if (!self.infoWindow.getContent()) {
            //Create the content of infoWindow
            var content = '<h3 class="info-title">' + self.name + ' / ' + self.name_fr + '</h3>';
            content += '<p class="info-address">Address: ' + self.address + ' / ' + self.address_fr + '</p>';
            content += '<p class="info-ID">ID: ' + self.parkID;
            content += '<p class="info-notes">NOTE: ' + self.notes;
            self.infoWindow.setContent(content);
        }

        //Open infoWindow
        self.infoWindow.open(map, self.mapMarker);
    };

    //Set object to active and make sure only one object active at a time
    self.activate = function() {
        if (SkateboardPark.prototype.active) {
            if (SkateboardPark.prototype.active !== self) {
                SkateboardPark.prototype.active.deactivate();
            }
        }
        //populate InfoWindow
        self.populateInfoWindow();
        //Set animation of marker when activate
        self.mapMarker.setAnimation(google.maps.Animation.BOUNCE);
        //Set object to active
        SkateboardPark.prototype.active = self;
    };

    //Close the infoWindow when its not active
    self.deactivate = function() {
        //Close infoWindow
        self.infoWindow.close();
        //Stop Bounce animation when deavtivate
        self.mapMarker.setAnimation(null);
        //Set object to none active
        SkateboardPark.prototype.active = null;
    };

    //When click on the list, it will center the map to certain location
    self.focus = function() {
        map.panTo({
            lat: self.latitude,
            lng: self.longitude
        });
        self.activate();
    };

    //When click on the mapMarker it will change the status of infoWindow(populate/close)
    self.mapMarker.addListener('click', function() {
        if (SkateboardPark.prototype.active === self) {
            self.deactivate();
        } else {
            self.activate();
        }
    });

    //When click close button of infoWindow make sure the infoWindow is not active
    self.infoWindow.addListener('closeclick', function() {
        self.deactivate();
    });
}

//View Model of the map
function MapViewModel() {
    var self = this;
    self.parks = ko.observableArray([]);
    self.filter = ko.observable('');
    self.isVisible = ko.observable(false);

    //Filter the results and change the visibility of mapMarker
    self.filterResults = ko.computed(function() {
        var results = [];

        //Find matches using regular expression and ignore case
        var re = new RegExp(self.filter(), 'i');

        //Find matches by iterate all objects,
        //Save object to results array if it's a match,
        //If not match, hide mapMaker and deactive the infoWindow
        self.parks().forEach(function(park) {
            if (park.name.search(re) !== -1) {
                results.push(park);
                park.mapMarker.setVisible(true);
            } else {
                park.mapMarker.setVisible(false);
                if (SkateboardPark.prototype.active === park) {
                    park.deactivate();
                }
            }
        });

        return results;
    });

    //Change visibility when click toggle button
    self.toggleVisibility = function() {
        self.isVisible(!self.isVisible());
    };

    //When list is clicked
    self.listClicked = function(park) {
        park.focus();

    };

    //Get the data from API asynchronously
    $.ajax({
        url: 'https://weekendchow.github.io/stateboard_park_API/stateboard_park.json',
        dataType: 'json',
        success: function(data) {
            data = data.query.results.json.features;

            var parks = [];
            var park;
            var bounds = new google.maps.LatLngBounds();
            data.forEach(function(dataObj) {
                park = new SkateboardPark(dataObj);
                parks.push(park);
                bounds.extend(park.mapMarker.position);

            });
            // console.log(parks);
            self.parks(parks);

            map.fitBounds(bounds);

        },
        error: function() {
            console.log("Opps,error happens! please load again.");
        }
    });

}
