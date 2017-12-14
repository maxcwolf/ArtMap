angular.module("app")

.factory("AuthFactory", function ($state, $http, $timeout, $location) {
    let currentUserData = null

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            currentUserData = user
            console.log("User is authenticated... ", user)
            $timeout(function () {
                $state.go('tabs.dash')
            }, 150);

        } else {
            currentUserData = null
            console.log("User is not authenticated")
            $timeout(function () {
                $state.go('auth')
            }, 150);
        }
    })

    return Object.create(null, {
        isAuthenticated: {
            value: () => {
                const user = currentUserData
                return user ? true : false
            }
        },
        getUser: {
            value: () => firebase.auth().currentUser
        },
        logout: {
            value: () => firebase.auth().signOut()
        },
        authenticate: {
            value: credentials =>
                firebase.auth()
                        .signInWithEmailAndPassword(
                            credentials.email,
                            credentials.password
                        )
        },
        registerWithEmail: {
            value: user =>
                firebase.auth()
                        .createUserWithEmailAndPassword(
                            user.email,
                            user.password,
                        )
        },
        updateProfile: {
            value: user =>
                firebase.auth().currentUser
                    .updateProfile({
                        displayName: user.displayName,
                        // photoURL: user.photoURL
                    })
        }
    })
})