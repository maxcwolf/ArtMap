angular.module('app')

    .controller("CameraCtrl", function ($scope, $cordovaCamera, $cordovaFile, $cordovaGeolocation, FileService, CameraFactory, $ionicLoading, $cordovaFileTransfer) {

        $scope.add = function(data) {
            var f = document.getElementById('file').files[0],
                r = new FileReader();

            r.onloadend = function(e) {
              var data = e.target.result;
              //send your binary data via $http or $resource or do anything else with it
              CameraFactory.addImg   (data)
            }

            r.readAsBinaryString(f);
        }


        //allow the map to be shown when changing back to the map state
        $scope.showMap = true

        let b64Img = ""

        //create scoped object for any text fields on picture
        $scope.picInput = {
            "artist": "",
            "name": ""
        }

        let lat = ""
        let long = ""
        let time = ""

        $scope.srcImage = "";
        $scope.takePhoto = function () {
            console.log('takephoto called')
            const picOptions = {
                quality: 50,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.CAMERA,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 350,
                targetHeight: 400,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false,
                correctOrientation: true
            };

            $cordovaCamera
                .getPicture(picOptions)
                .then(function (imageData) {
                    $scope.srcImage = "data:image/jpeg;base64," + imageData;
                    b64Img = imageData;
            })

            const geoOptions = {
                enableHighAccuracy: true
            }

            $cordovaGeolocation
                .getCurrentPosition(geoOptions)
                .then(function (position) {
                    console.log(JSON.stringify(position))
                    lat = position.coords.latitude
                    long = position.coords.longitude
                    time = position.timestamp
            })


        }

        //TRY TO CONVERT URL TO BLOB URL
        function fetchLocalFileViaCordova(path, successCallback, errorCallback) {
            console.log("path is...", path)

            window.resolveLocalFileSystemURL(path, function (entry) {
                console.log("entry is ...", JSON.stringify(entry))
                entry.file(successCallback, errorCallback);
            }, errorCallback);
        };

        function fetchLocalFileViaCordovaAsArrayBuffer(path, successCallback, errorCallback) {
            fetchLocalFileViaCordova(path, function (file) {
                var reader = new FileReader();

                reader.onload = function (e) {
                    console.log("reader result is...", JSON.stringify(e.target.result));
                };

                reader.readAsArrayBuffer(file);
            }, errorCallback);
        };

        function fetchLocalFileViaCordovaAsURL(path, successCallback, errorCallback) {
            // Convert fake Cordova file to a real Blob object, which we can create a URL to.
            fetchLocalFileViaCordovaAsArrayBuffer(path, function (arrayBuffer) {
                var blob = new Blob([arrayBuffer]);
                var url = URL.createObjectURL(blob);
                $scope.srcImage = url
                console.log("the blob is...", JSON.stringify(blob))
                console.log("the final url for the image is...", url)
            }, errorCallback);
        };



        $scope.uploadPhoto = function (photo) {
            //show loading spinner
            $ionicLoading.show();

            //creating empty object for pic data
            let picData = {}



            // Points to 'images/space.jpg'
            // Note that you can use variables to create child values
            var fileName = 'space.jpg';



            //UPLOAD PHOTO

            //generate a unique id for each photo
            function uidGenerator() {
                return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
                    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
                )
            }

            const photoId = uidGenerator()

            //get the token object from local storage that is created at login by the server
            const token = JSON.parse(localStorage.getItem("token"))

            //get the UserId from the token object
            const uid = token.UserId

            //convert b64 to blob
            const b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
                const byteCharacters = atob(b64Data);
                const byteArrays = [];

                for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                    const slice = byteCharacters.slice(offset, offset + sliceSize);

                    const byteNumbers = new Array(slice.length);
                    for (let i = 0; i < slice.length; i++) {
                        byteNumbers[i] = slice.charCodeAt(i);
                    }

                    const byteArray = new Uint8Array(byteNumbers);

                    byteArrays.push(byteArray);
                }

                const blob = new Blob(byteArrays, { type: contentType });
                return blob;
            }

            const contentType = 'image/jpeg';

            const blob = b64toBlob(b64Img, contentType);
            const blobUrl = URL.createObjectURL(blob);

            $cordovaFileTransfer.upload('http://7670056c.ngrok.io/api/posts', blob)
                .then(

                    function (result) { },
                    function (err) { },
                    function (progress) { },
                    function () {
                        // Populate the picData object
                        picData = {
                            "userId": uid,
                            "photoId": photoId,
                            "lat": lat,
                            "long": long,
                            "artist": $scope.picInput.artist,
                            "title": $scope.picInput.title
                        }
                        console.log("Pic upload complete, uploading picData to database....", JSON.stringify(picData))
                        //post data to firebase database
                        CameraFactory.addImg(picData)

                        $scope.srcImage = "../../../img/placeholder.jpg"
                        $scope.picInput = {
                            "artist": "",
                            "name": ""
                        }

                        //hide loading spinner
                        $ionicLoading.hide();
                    });




        }
    })