angular
  .module('app')
  .factory("MarkerFactory", function ($http, API) {
    return Object.create(null, {
        "cache": {
            value: null,
            writable: true
        },
        "all": {
            value: function () {
                return $http({
                    "url": `${API.URL}/api/posts`,
                    "method": "GET"
                }).then(response => {
                    const data = response.data
                    return data
                    console.log("Album response: ", data)
                })
            }
        },
        "OLD_all": {
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
        },
        "single": {
            value: function (id) {
                return $http({
                    "url": `${API.URL}/api/posts/${id}`,
                    "method": "GET"
                })
            }
        },
        "OLD_single": {
            value: function (id) {
                return firebase.auth().currentUser.getIdToken(true)
                .then(idToken => {
                    return $http({
                        method: "GET",
                        url: `${FIREBASE_CONFIG.databaseURL}/images/${id}.json?auth=${idToken}`
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