angular.module('app')
    .controller('AlbumCtrl', function ($scope, $timeout, AlbumFactory) {

        //get the token object from local storage that is created at login by the server
        const token = JSON.parse(localStorage.getItem("token"))

        //get the UserId from the token object
        const user = token.UserId

        console.log(user)
        //get just the uid of the user

        $scope.album = []

        const getAlbums = function () {
            AlbumFactory.getUserAlbum(user).then(function(response) {
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