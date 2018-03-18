angular.module('app')
    .controller('AlbumCtrl', function ($scope, $timeout, AlbumFactory) {

        //get the token object from local storage that is created at login by the server
        const token = JSON.parse(localStorage.getItem("token"))

        //get the UserId from the token object
        const uid = token.UserId

        console.log(uid)
        //get just the uid of the user

        $scope.album = []

        const getAlbums = function (userid) {
            AlbumFactory.getUserAlbum(userid).then(function(response) {
            $timeout(console.log("waiting for photo"), 300) // <-- this sucks

            //filter the response to only contain the posts of the logged in user
            const userAlbum = response.find(function (obj) { return obj.userId === userid; });
            $scope.album.push(userAlbum)

            // $scope.album = response

            console.log(userAlbum)


            })
        }

        $timeout(getAlbums(uid), 50)


        console.log(" 2nd call album is", $scope.album)

        $scope.deletePhoto = function (id) {
            console.log("Deleting photo ", id)
            AlbumFactory.deletePhotoDb(id)
            const picEl = document.getElementById(id)
            picEl.parentNode.removeChild(picEl)
        }

})