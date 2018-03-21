angular
    .module("app")
    .factory("CameraFactory", function ($http, API) {
        return Object.create(null, {
            "cache": {
                value: null,
                writable: true
            },
            "addImg": {
                value: function (data) {
                    console.log('add image factory running...  data:', JSON.stringify(data))

                    return $http({
                        method: "POST",
                        url: `${API.URL}/api/posts`,
                        data: {
                            "userId": data.userId,
                            "photoId": data.photoId,
                            "lat": data.lat,
                            "long": data.long,
                            "artist": data.artist,
                            "title": data.title,
                            "photoURI": data.photoURI
                            }
                    })
                }
            },
            "addImgData": {
                value: function (data, name) {

                    return $http({
                        method: "POST",
                        url: `${API.URL}/api/posts/upload`,
                        data: {
                            "ImgStr": data,
                            "ImgName": name
                        }
                    })
                }
            }
        })
    })