angular
.module("app")
.factory("CameraFactory", function ($http, FIREBASE_CONFIG) {
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
        },
        "addImg": {
            value: function (data) {
                return firebase.auth().currentUser.getIdToken(true)
                .then(idToken => {
                    return $http({
                        method: "POST",
                        url: `${FIREBASE_CONFIG.databaseURL}/images/.json?auth=${idToken}`,
                        data: {
                            "userId": data.userId,
                            "photoId": data.photoId,
                            "lat": data.lat,
                            "long": data.long,
                            "time": data.time,
                            "artist": data.artist,
                            "imgUrl": data.imgUrl
                        }
                    })
                })
            }
        },
        "remove": {
            value: function (key) {
                return $http({
                    method: "DELETE",
                    url: `https://angular-employees-6727b.firebaseio.com/employees/${key}/.json`
                })
            }
        },
        "replace": {
            value: function (employee, key) {
                employee.employmentEnd = Date.now()

                return $http({
                    method: "PUT",
                    url: `https://angular-employees-6727b.firebaseio.com/employees/${key}/.json`,
                    data: employee
                })
            }
        }
    })
})