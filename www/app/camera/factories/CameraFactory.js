angular
.module("app")
.factory("CameraFactory", function ($http) {
    return Object.create(null, {
        "cache": {
            value: null,
            writable: true
        },
        "addImg": {
            value: function (picData) {
                return firebase.auth().currentUser.getIdToken(true)
                .then(idToken => {
                    return $http({
                        method: "POST",
                        url: `https://artmap-188120.firebaseio.com/images/.json?auth=${idToken}`,
                        data: {
                            "userId": picData.userId,
                            "photoId": picData.photoId,
                            "lat": picData.lat,
                            "long": picData.long,
                            "time": picData.time,
                            "artist": picData.artist
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