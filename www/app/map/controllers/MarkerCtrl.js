angular.module('app')
.controller('MarkersCtrl', function ($scope, MarkerFactory) {
    $scope.markers = MarkerFactory.all();
    $scope.remove = function (marker) {
      MarkerFactory.remove(marker);
    };
  })
