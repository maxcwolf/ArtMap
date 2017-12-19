angular.module('app')
    .controller('MapCtrl', function ($scope, $state, $ionicLoading, MarkerFactory, $cordovaGeolocation) {
        // $scope.markers = []
        function initialize() {
            let mapOptions = {
                center: new google.maps.LatLng(36.161049, -86.777223),
                zoom: 12,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            let map = new google.maps.Map(document.getElementById("map"), mapOptions)

            function placeMarkers() {
                //Get all of the markers from factory
                MarkerFactory.all().then(data => {
                    console.log("Markers: ", data);
                    $scope.markers = data;
                    for (let i = 0; i < data.length; i++) {
                        markerEl = data[i];
                        markerSpot = new google.maps.LatLng(markerEl.lat, markerEl.lng);
                        // Add the markerto the map
                        let marker = new google.maps.Marker({
                            animation: google.maps.Animation.DROP,
                            position: markerSpot,
                            map: map
                        });

                        windowContent =
                            "<h4>" + markerEl.name + "</h4>" +
                            '<a href="http://www.' + markerEl.website + '"target="_blank">' + markerEl.website + "</a>";


                        marker.addListener('click', function () {
                            map.setZoom(15);
                            infowindow.open(map, marker);
                        });
                        let infowindow = new google.maps.InfoWindow({
                            content: windowContent
                        });
                        google.maps.event.addListener(infowindow, 'closeclick', function () {
                            map.setZoom(12);
                            map.setCenter({lat: 36.161049, lng: -86.777223})
                        });

                    }//END for Loop

                });//END of then
            }// END of place Markers
            $scope.map = map;
            placeMarkers();
            // Stop the side bar from dragging when mousedown/tapdown on the map
            google.maps.event.addDomListener(document.getElementById("map"), 'mousedown', function (e) {
                e.preventDefault();
                return false;
            });

        }//END intialize

        $scope.centerOnMe = function () {
            console.log("Centering");
            if (!$scope.map) {
                return;
            }

            $scope.loading = $ionicLoading.show({
                content: 'Getting current location...',
                showBackdrop: false
            });

            $cordovaGeolocation.getCurrentPosition(function (pos) {
                console.log('Got pos', pos);
                $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
                $scope.loading.hide();
            }, function (error) {
                alert('Unable to get location: ' + error.message);
            });
        };
        if (document.readyState === "complete") {
            initialize();
        } else {
            google.maps.event.addDomListener(window, 'load', initialize);
        }

    });