angular
  .module('app')
  .factory("MarkerFactory", function ($http, FIREBASE_CONFIG) {
    return Object.create(null, {
        "cache": {
            value: null,
            writable: true
        },
        "all": {
            value: function () {
                return firebase.auth().currentUser.getIdToken(true)
                .then(idToken => {
                    return $http({
                        method: "GET",
                        url: `${FIREBASE_CONFIG.databaseURL}/images/.json?auth=${idToken}`
                    }).then(response => {
                        const data = response.data

                        this.cache = Object.keys(data).map(key => {
                            data[key].id = key
                            return data[key]
                        })

                        return this.cache
                    })
                })
            }
        }
    })
  })
            // get: function (markerId) {
            //   for (var i = 0; i < markers.length; i++) {
            //     if (markers[i].id === parseInt(markerId)) {
            //       return markers[i];
            //     }
            //   }
            //   return null;
            // }