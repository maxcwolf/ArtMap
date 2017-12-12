angular.module('app')
.factory('Markers', function () {
    // Might use a resource here that returns a JSON array

    // Some fake testing data
    var markers = [{
      id: 0,
      name: 'Sam Flores',
      lastText: 'Bear Face',
      face: 'https://i.pinimg.com/736x/25/85/71/2585714afee7dc6c3d27f0ed1585a460--graffiti-weird.jpg',
      lat: "36.183533",
      lng: "-86.747300"
    }, {
      id: 1,
      name: 'David Choe',
      lastText: 'Lawernce St Piece',
      face: 'https://c1.staticflickr.com/9/8512/8385870630_f86414be9c_b.jpg',
      lat: "36.148809",
      lng: "-86.842282"
    }];

    return {
      all: function () {
        return markers;
      },
      remove: function (marker) {
        markers.splice(markers.indexOf(marker), 1);
      },
      get: function (markerId) {
        for (var i = 0; i < markers.length; i++) {
          if (markers[i].id === parseInt(markerId)) {
            return markers[i];
          }
        }
        return null;
      }
    };
  })