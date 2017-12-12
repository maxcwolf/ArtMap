angular.module('app')
.controller('MarkersCtrl', function ($scope, Markers) {
    $scope.markers = Markers.all();
    $scope.remove = function (marker) {
      Markers.remove(marker);
    };
  })
