angular
.module("app")
.factory("RatingFactory", function ($http, FIREBASE_CONFIG) {
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
                        url: `${FIREBASE_CONFIG.databaseURL}/ratings/.json?auth=${idToken}`
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
        "rate": {
            value: function (vote) {
                vote.timeStamp = Date.now()
                return firebase.auth().currentUser.getIdToken(true)
                    .then(idToken => {
                        return $http({
                            method: "POST",
                            url: `${FIREBASE_CONFIG.databaseURL}/ratings/.json?auth=${idToken}`,
                            data: vote
                        })
                    }
                    )
            }
        },
        "getUserRatings": {
            value: function (fanUID) {
                return firebase.auth().currentUser.getIdToken(true)
                    .then(idToken => {
                        return $http({
                            method: "GET",
                            url: `${FIREBASE_CONFIG.databaseURL}/ratings/.json?auth=${idToken}&orderBy="userId"&equalTo="${userId}"`,
                        }).then(response => {
                            response = response.data
                            let dataArray =
                                Object.keys(response)
                                    .map(key => {
                                        response[key].id = key
                                        return response[key]
                                    })

                            return dataArray
                        })
                    }
                )
            }
        },
        "updateRating": {
            value: function (voteID, vote) {
                return firebase.auth().currentUser.getIdToken(true)
                    .then(idToken => {
                        return $http({
                            method: "PUT",
                            url: `${FIREBASE_CONFIG.databaseURL}/voteTable/${ratingId}/vote/.json?auth=${idToken}`,
                            data: vote
                        })
                    }
                )
            }
        },
        "removeRating": {
            value: function (voteID) {
                return firebase.auth().currentUser.getIdToken(true)
                    .then(idToken => {
                        return $http({
                            method: "DELETE",
                            url: `${FIREBASE_CONFIG.databaseURL}/voteTable/${ratingId}/.json?auth=${idToken}`,
                        })
                    }
                )
            }
        },
    })
})