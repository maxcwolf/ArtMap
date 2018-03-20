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

                return $http({
                    "url": `http://7670056c.ngrok.io/api/posts?orderBy="UserId"&equalTo="${uid}"`, //?orderBy="UserId"&equalTo="${uid}"
                    "method": "GET"
                }).then(response => {
                    const data = response.data
                    return data
                    console.log("Album response: ", data)
                })
            }
        },
        "OLD_getUserAlbum_REMOVE IN PRODUCTION": {
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
            value: function (id) {

                return $http({
                    "url": `http://localhost:5000/api/posts/${id}`,
                    "method": "DELETE"
                })
            }
        }
    })
})