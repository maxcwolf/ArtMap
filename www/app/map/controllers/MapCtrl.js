//MAP FUNCTION
angular.module('app')
    .controller('MapCtrl', function ($scope, $compile, Markers) {
        $scope.$on('$ionicView.loaded', function () {
            if (window.google) {
                if (window.google.maps === undefined) {
                    console.log("maps isn't loaded!");
                } else {
                    initialize();
                }
            } else {
                console.log("google isn't loaded!");
            }
        });



        function initialize() {
            console.log("initializing map");
            //set the initial center point on map load
            var myLatlng = new google.maps.LatLng(36.161968, -86.781160);

            var mapOptions = {
                center: myLatlng,
                zoom: 12,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            var map = new google.maps.Map(document.getElementById("map"),
                mapOptions);

            $scope.map = map;

            drawMarkers();

        }

        function drawMarkers() {

            if ($scope.markers == undefined)
                $scope.markers = [];

            var infoWindow = new google.maps.InfoWindow();

            var createMarker = function (marker) {
                var marker = new google.maps.Marker({
                    map: $scope.map,
                    position: new google.maps.LatLng(marker.lat, marker.lng),
                    title: marker.lastText
                });
                marker.content = '<div class="infoWindowContent">' + marker.name + '</div>';
                var contentString = "<div class='infoWindowContent' ng-click='clickTest()'><h3>" + marker.name + "</h3><p>" + marker.lastText + "</div>";
                var compiled = $compile(contentString)($scope);

                google.maps.event.addListener(marker, 'click', function () {
                    infoWindow.setContent(compiled[0]);
                    infoWindow.open($scope.map, marker);
                });

                $scope.markers.push(marker);
                $scope.bounds.extend(marker.position);
            }

            var markers = Markers.all();
            if (markers.length > 0) {
                $scope.bounds = new google.maps.LatLngBounds();

                for (i = 0; i < markers.length; i++) {
                    createMarker(markers[i]);
                }

                $scope.map.fitBounds($scope.bounds);

                $scope.openInfoWindow = function (e, selectedMarker) {
                    e.preventDefault();
                    google.maps.event.trigger(selectedMarker, 'click');
                }
            }
        }

    });