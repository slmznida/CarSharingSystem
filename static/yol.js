var map;
                    var currentLocation;
                    var directionsManager,infobox, searchManager;


                    // function that is called when Bing Maps finishes loading
                    function loadMapScenario() {
                        // create a Map, centered in Hamilton
                        map = new Microsoft.Maps.Map(
                            document.getElementById('myMap'), {
                                center: new Microsoft.Maps.Location(41.015137, 28.879530),
                                zoom: 11
                            });
                        
                        //Create an infobox at the center of the map but don't show it.
                            infobox = new Microsoft.Maps.Infobox(map.getCenter(), {
                                visible: false
                            });
                        
                        //Assign the infobox to a map instance.
                            infobox.setMap(map);


                        //Load the directions module.
                        Microsoft.Maps.loadModule('Microsoft.Maps.Directions', function() {
                            //Create an instance of the directions manager.
                            directionsManager = new Microsoft.Maps.Directions.DirectionsManager(map);

                            //Specify the element in which the itinerary will be rendered.
                            directionsManager.setRenderOptions({
                                itineraryContainer: '#directionsItinerary'
                            });

                            //Calculate directions.
                            directionsManager.calculateDirections();
                        });



                        




                        function sucess(position) {
                            latitude = position.coords.latitude;
                            longitude = position.coords.longitude;

                            currentLocation = new Microsoft.Maps.Location(
                                position.coords.latitude,
                                position.coords.longitude);

                            //Create custom Pushpin
                            var pin = new Microsoft.Maps.Pushpin(currentLocation, {
                                color: 'blue',
                                title: 'Konumunuz!'
                            });

                            pin.metadata = {
                                description: "<b>User</b> <br> Lattitude : " + latitude + " <br>" + "Longitude : " + longitude + " "
                            };

                            

                            

                            //Add a click event handler to the pushpin.
                            Microsoft.Maps.Events.addHandler(pin, 'click', pushpinClicked);


                            //Add the pushpin to the map
                            map.entities.push(pin);





                        }

                        function error(noPosition) {
                            document.getElementById('error').innerHTML = "PERMISSION_DENIED: The Location acquisition process <b>Failed</b> Because the Document does<br> not have permission to use the Location API";
//                            pageScroll();
//                            map.setView({
//                                zoom: 15
//                            });
                        }


                        navigator.geolocation.getCurrentPosition(sucess, error);
                        tumYakit();
                        

                    }









                    function removePushPin() {

                        for (var i = map.entities.getLength() - 1; i >= 0; i--) {
                            var pushpin = map.entities.get(i);
                            if (pushpin instanceof Microsoft.Maps.Pushpin) {
                                map.entities.removeAt(i);
                            }
                        }

                    }

                    function turYakit(yakit) {

                        removePushPin();
                        
                        infobox.setOptions({
                            visible: false
                        });

                        // Loop over the Education data contained in education.js
                        for (i = 0; i < education.length; i++) {
                            if (education[i].YAKIT == yakit) {
                                // create a new location for this education 
                                var location = new Microsoft.Maps.Location(
                                    education[i].LATITUDE,
                                    education[i].LONGITUDE
                                );

                                // create a pushpin at this location, give it a label with 
                                // the Education name
                                var pushpin = new Microsoft.Maps.Pushpin(
                                    location, {
                                        title: education[i].NAME
                                    });
                                //Store some metadata with the pushpin.
                                pushpin.metadata = {
                                    description: "<a href = ' " + education[i].WEBSITE + "' target = '_blank' > " + education[i].NAME + " </a><br> " +
                                        " " +
                                        "Yakıt : " + education[i].YAKIT + "<br>" +
                                        "Marka : " + education[i].MARKA + "<br>" +
                                        "<a href='#' onclick='return direction(" + education[i].LATITUDE + "," + education[i].LONGITUDE + ");" + "'> Yol tarifi al</a>"

                                };

                                //Add a click event handler to the pushpin.
                                Microsoft.Maps.Events.addHandler(pushpin, 'click', pushpinClicked);

                                //Add pushpin to the map.
                                map.entities.push(pushpin);
                            }
                        }
                        clearDirection();
                    }


                    function tumYakit() {
                        removePushPin();
                        infobox.setOptions({
                            visible: false
                        });


                        // Loop over the Education data contained in education.js
                        for (i = 0; i < education.length; i++) {
                            // create a new location for this education 
                            var location = new Microsoft.Maps.Location(
                                education[i].LATITUDE,
                                education[i].LONGITUDE
                            );

                            // create a pushpin at this location, give it a label with 
                            // the Education name
                            var pushpin = new Microsoft.Maps.Pushpin(
                                location, {
                                    title: education[i].NAME
                                });



                            //Store some metadata with the pushpin.
                            pushpin.metadata = {
                                description: "<a href = ' " + education[i].WEBSITE + "' target = '_blank' > " + education[i].NAME + " </a><br> " +
                                    " " +
                                    "Yakıt : " + education[i].YAKIT + "<br>" +
                                    "Marka : " + education[i].MARKA + "<br>" +
                                    "<a href='#' onclick='return direction(" + education[i].LATITUDE + "," + education[i].LONGITUDE + ");" + "'> Yol tarifi al</a>"

                            };

                            //Add a click event handler to the pushpin.
                            Microsoft.Maps.Events.addHandler(pushpin, 'click', pushpinClicked);

                            //Add pushpin to the map.
                            map.entities.push(pushpin);
                        }
                        
                        clearDirection();
                    }







                    function pushpinClicked(e) {
                        //Make sure the infobox has metadata to display.
                        if (e.target.metadata) {
                            //Set the infobox options with the metadata of the pushpin.
                            infobox.setOptions({
                                location: e.target.getLocation(),
                                title: e.target.metadata.title,
                                description: e.target.metadata.description,
                                visible: true
                            });
                        }
                    }


                    //search function

                    function Search() {
                        if (!searchManager) {
                            //Create an instance of the search manager and perform the search.
                            Microsoft.Maps.loadModule('Microsoft.Maps.Search', function() {
                                searchManager = new Microsoft.Maps.Search.SearchManager(map);
                                Search()
                            });
                        } else {
                            //Remove any previous results from the map.
                            //map.entities.clear();

                            //Get the users query and geocode it.
                            var query = document.getElementById('searchTbx').value;
                            geocodeQuery(query);
                        }
                    }

                    function geocodeQuery(query) {
                        var searchRequest = {
                            where: query,
                            callback: function(r) {
                                if (r && r.results && r.results.length > 0) {
                                    var pin, pins = [],
                                        locs = [],
                                        output = 'Results:<br/>';


                                    //Create a pushpin for each result. 
                                    pin = new Microsoft.Maps.Pushpin(r.results[0].location, {
                                        title: document.getElementById("nameofpin").value,
                                        color: 'red'
                                    });
                                    pins.push(pin);
                                    locs.push(r.results[0].location);


                                    //Add the pins to the map
                                    map.entities.push(pins);


                                    //Determine a bounding box to best view the results.
                                    var bounds;

                                    if (r.results.length == 1) {
                                        bounds = r.results[0].bestView;
                                    } else {
                                        //Use the locations from the results to calculate a bounding box.
                                        bounds = Microsoft.Maps.LocationRect.fromLocations(locs);
                                    }

                                    map.setView({
                                        bounds: bounds
                                    });
                                }
                            },
                            errorCallback: function(e) {
                                //If there is an error, alert the user about it.
                                alert("No results found.");
                            }
                        };

                        //Make the geocode request.
                        searchManager.geocode(searchRequest);
                    }

                    //clear direction
                    function clearDirection() {
                        directionsManager.clearAll();
                        directionsManager.clearDisplay();

                    }


                    //Direction

                    function direction(latt, long) {
                        clearDirection();

                        var CurrentWayPoint = new Microsoft.Maps.Directions.Waypoint({
                            address: 'Current Location',
                            location: new Microsoft.Maps.Location(latitude, longitude)
                        });

                        directionsManager.addWaypoint(CurrentWayPoint);

                        console.log(latitude + " and " + longitude);
                        console.log("latt: " + latt + " and long " + long);

                        var schoolWaypoint = new Microsoft.Maps.Directions.Waypoint({
                            address: ' Araç Rotası ',
                            location: new Microsoft.Maps.Location(latt, long)
                        });

                        directionsManager.addWaypoint(schoolWaypoint);

                        //Specify the element in which the itinerary will be rendered.
                        directionsManager.setRenderOptions({
                            itineraryContainer: '#directionsItinerary'
                        });

                        //Calculate directions.
                        directionsManager.calculateDirections();



                    }