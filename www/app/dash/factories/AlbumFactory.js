angular
  .module('app')
  .factory("AlbumFactory", function ($http, FIREBASE_CONFIG, API) {
    return Object.create(null, {
        "cache": {
            value: null,
            writable: true
        },
        "getUserAlbum": {
            value: function (uid) {

                return $http({
                    "url": `${API.URL}/api/posts`, //?orderBy="UserId"&equalTo="${uid}"
                    "method": "GET"
                }).then(response => {
                    const data = response.data
                    return data
                    console.log("Album response: ", JSON.stringify(data))
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