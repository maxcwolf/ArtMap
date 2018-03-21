angular
    .module("app")
    .factory("CameraFactory", function ($http) {
        return Object.create(null, {
            "cache": {
                value: null,
                writable: true
            },
            "addImg": {
                value: function (data) {

                    return $http({
                        method: "POST",
                        url: `http://7670056c.ngrok.io/api/posts`,
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

                    console.log("DATA:  ", data)
                    console.log("NAME:  ", name)

                    return $http({
                        method: "POST",
                        url: `http://7670056c.ngrok.io/api/posts/upload`,
                        data: {
                            "ImgStr": data,
                            "ImgName": name
                        }
                    })
                }
            }
        })
    })