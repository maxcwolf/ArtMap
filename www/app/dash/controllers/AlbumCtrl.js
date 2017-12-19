angular.module('app')
    .controller('AlbumCtrl', function ($scope, $timeout, AlbumFactory) {

        //get firebase user data from local storage
        const userKey = Object.keys(window.localStorage)
            .filter(it => it.startsWith('firebase:authUser'))[0];
        //get all the user info as an object
        const user = userKey ? JSON.parse(localStorage.getItem(userKey)) : undefined;
        //get just the uid of the user

        $scope.album = []

        const getAlbums = function () {
            AlbumFactory.getUserAlbum(user.uid).then(function(response) {
            $timeout(console.log("waiting for photo"), 300) // <-- this sucks
            $scope.album = response

            console.log(response)


            })
        }

        $timeout(getAlbums, 50)


        console.log(" 2nd call album is", $scope.album)

        $scope.deletePhoto = function (id) {
            console.log("Deleting photo ", id)
            AlbumFactory.deletePhotoDb(id)
            const picEl = document.getElementById(id)
            picEl.parentNode.removeChild(picEl)
        }

})