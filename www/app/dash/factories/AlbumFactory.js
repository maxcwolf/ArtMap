angular
  .module('app')
  .factory("AlbumFactory", function ($http, FIREBASE_CONFIG) {
    return Object.create(null, {
        "cache": {
            value: null,
            writable: true
        },
        "getUserAlbum": {
            value: function (uid) {
                return firebase.auth().currentUser.getIdToken(true)
                .then(idToken => {
                    return $http({
                        method: "GET",
                        url: `${FIREBASE_CONFIG.databaseURL}/images/.json?auth=${idToken}&orderBy="userId"&equalTo="${uid}"`
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
        "deletePhotoDb": {
            value: function(id) {
                return firebase.auth().currentUser.getIdToken(true)
                .then(idToken => {
                    return $http({
                        method: "DELETE",
                        url: `${FIREBASE_CONFIG.databaseURL}/images/${id}.json?auth=${idToken}`
                    })
                })
            }
        }
    })
})