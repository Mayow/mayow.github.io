// Global Map and InfoWindow References
var map;
var infoWindow;
/* Initialize Google Map */
function googleSuccess() {
    // Map settings
    var mapOptions = {
        center: {
            lat: 39.979,
            lng: -83.009
        },
        zoom: 13,
        disableDefaultUI: true
    };
    // Instantiate global map variable
    map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);
    // Instantiate global info window
    infoWindow = new google.maps.InfoWindow({
        maxWidth: 300
    });
    ko.applyBindings(new ViewModel());
    return true;
};
/* ViewModel in MVVM */
var ViewModel = function() {
    // Reference to ViewModel
    var self = this;
    // Information about a single map location
    this.Location = function(title, lat, lng, keyWords, street, city) {
        // Store information about the location
        this.title = ko.observable(title);
        this.lat = ko.observable(lat);
        this.lng = ko.observable(lng);
        this.keyWords = ko.observableArray(keyWords);
        this.street = ko.observable(street);
        this.city = ko.observable(city);
        // Create map marker
        this.marker = new google.maps.Marker({
            position: new google.maps.LatLng(lat, lng),
            animation: google.maps.Animation.DROP,
            title: title,
        });
        // Google Street View
        this.streetViewImg = ko.observable(
            '<img class="bgimg" src="http://maps.googleapis.com/maps/api/streetview?size=600x400&location=' +
            street + ', ' + city + '">');
        // Wikipedia Links
        this.wikiInfo = ko.observable('');
        // Reference to current location for use in event handlers
        var temp = this;
        // Infowindow information
        this.info = ko.computed(function() {
            return '<div>' + '<h3>' + temp.title() + '</h3>' +
                '<div><p>' + temp.keyWords().join(', ') +
                '<br><br>' + temp.wikiInfo() + '<br>' +
                '<div class="hidden-xs hidden-sm col-md-12">' +
                temp.streetViewImg() + '</div>' + '</p></div>' +
                '</div>';
        });
        // Add click event to show info window
        google.maps.event.addListener(this.marker, 'click', function() {
            temp.reveal();
        });
        this.reveal = function() {
            map.setCenter(temp.marker.getPosition());
            infoWindow.setContent(temp.info());
            infoWindow.open(map, temp.marker);
            temp.marker.setAnimation(google.maps.Animation.BOUNCE);
            window.setTimeout(function() {
                temp.marker.setAnimation(null);
            }, 700);
        };
        // Set marker map
        this.marker.setMap(map);
    };
    // A list of all location objects
    this.generateLocationList = function() {
        // Declare variables
        var locations = [];
        var keyWords;
        // Instantiate all locations
        keyWords = ['museum', 'shows', 'art'];
        locations.push(ko.observable(new self.Location(
            'Columbus Museum of Art', 39.964245, -82.9878,
            keyWords, '480 E Broad St', 'Columbus, OH')));
        keyWords = ['shows', 'arena', 'sports'];
        locations.push(ko.observable(new self.Location(
            'Nationwide Arena', 39.9694, -83.0059, keyWords,
            '200 W Nationwide Blvd', 'Columbus, OH')));
        keyWords = ['shows', 'music', 'arts'];
        locations.push(ko.observable(new self.Location('Palace Theatre',
            39.9622, -83.0018, keyWords, '34 W Broad St',
            'Columbus, OH')));
        keyWords = ['science', 'learning', 'education'];
        locations.push(ko.observable(new self.Location('COSI Columbus',
            39.9597, -83.00718, keyWords, ' 333 W Broad St',
            'Columbus, OH')));
        keyWords = ['arena', 'shows', 'events'];
        locations.push(ko.observable(new self.Location('Greater Columbus Convention Center'
			,39.9703, - 83.0008, keyWords, '400 N High St',
            'Columbus, OH')));
			
        keyWords = ['music', 'shows', 'events'];
        locations.push(ko.observable(new self.Location('Express Live!',
            39.9698, -83.0101, keyWords, '405 Neil Ave',
            'Columbus, OH')));	
			
		keyWords = ['music', 'football ', 'events'];
        locations.push(ko.observable(new self.Location('Ohio Stadium',
            40.0017 , -83.0197, keyWords, '411 Woody Hayes Dr',
            'Columbus, OH')));
			
		keyWords = ['store', 'mall ', 'shopping'];
        locations.push(ko.observable(new self.Location('Easton Town Center',
            40.0530758,-82.9151949, keyWords, '160 Easton Town Center',
            'Columbus, OH')));
		
		keyWords = ['music', 'shopping ', 'events'];
        locations.push(ko.observable(new self.Location('The Short North',
            39.97972,-83.00471 , keyWords, '830 N High St',
            'Columbus, OH')));
			
		keyWords = ['plays', 'concerts ', 'events'];
        locations.push(ko.observable(new self.Location('Ohio Theatre (Columbus, Ohio)',
            39.9598468,-82.9993631 , keyWords, '41 E State St',
            'Columbus, OH')));
			
        return locations;
    };
    this.allLocations = ko.observable(this.generateLocationList());
    // Initial value for search input field
    var defaultString = 'Search';
    // Search string
    this.searchString = ko.observable('');
    // Computed observable, filtered based on searchString
    this.locations = ko.computed(function() {
        // Instantiate observable array
        var filteredLocations = ko.observableArray();
        // Determine filter from search string
        var filter = self.searchString().toLowerCase();
        // Iterate over locations
        self.allLocations().forEach(function(location) {
            // Set all location markers to be invisible
            location().marker.setVisible(false);
            // Check if title contains filter or the filter is the default string
            if (location().title().toLowerCase().indexOf(
                    filter) != -1 || self.searchString() ===
                defaultString) {
                filteredLocations.push(location());
                location().marker.setVisible(true);
            } else {
                var words = location().keyWords();
                // Iterate over all words
                for (var i = 0; i < words.length; i++) {
                    // If word contains searchString, push location
                    if (words[i].toLowerCase().indexOf(
                        filter) != -1) {
                        filteredLocations.push(location());
                        location().marker.setVisible(true);
                        break;
                    }
                }
            }
        });
        return filteredLocations();
    });
    // Determine wikipedia information
    this.wikipedia = function() {
        var wikipediaRequest = function(index) {
            // Wikipedia request error handling
            var wikiRequestTimeout = setTimeout(function() {
                self.locations()[index].wikiInfo(
                    'No Wikipedia info to dispay.<br>');
            }, 4000); // 1 second timeout error
            // Request
            $.ajax({
                url: wikiUrl,
                dataType: 'jsonp',
                success: function(response) {
                    // string to replace wikInfo
                    var newWikiInfo = self.locations()[
                        index].wikiInfo();
						                    newWikiInfo = newWikiInfo.concat(response[2][0]+ '<br>' +'<br>'+ 'Wikipedia:' + '<ul>');

                   
                    // obtain articles from response
					//console.log(response[1]);
                    var articleList = response[1];
                    for (var j = 0; j < articleList.length; j++) {
                        // display up to three wikipedia articles
                        if (j > 3) {
                            break;
                        }
                        var articleStr = articleList[j];
                        var url =
                            'http://en.wikipedia.org/wiki/' +
                            articleStr;
						//INFO box
                        newWikiInfo = newWikiInfo.concat(
                            '<li> <a href="' + url +
                            '">' + articleStr +
                            '</a></li>');
                    }
                    clearTimeout(wikiRequestTimeout);
					
                    newWikiInfo = newWikiInfo.concat(
                        '</ul>');
						
                    self.locations()[index].wikiInfo(
                        newWikiInfo);
                }
            });
        };
        // Iterate through all locations
        for (var i = 0; i < self.locations().length; i++) {
            // Wikipedia AJAX Request
            var wikiUrl =
                'http://en.wikipedia.org/w/api.php?action=opensearch&search=' +
                self.locations()[i].title() +
                '&format=json&callback=wikiCallBack';
            wikipediaRequest(i);
        }
    };
    this.wikipedia();
};

function yourErrorHandlingFunction() {
    alert("ERROR!");
};
