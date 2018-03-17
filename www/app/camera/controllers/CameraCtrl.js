angular.module('app')

    .controller("CameraCtrl", function ($scope, $cordovaCamera, $cordovaFile, $cordovaGeolocation, FileService, CameraFactory, $ionicLoading) {

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

            //CREATING STORAGE REF
            // Points to the root reference
            var storageRef = firebase.storage().ref();

            // Points to 'images'
            var imagesRef = storageRef.child('images');

            // Points to 'images/space.jpg'
            // Note that you can use variables to create child values
            var fileName = 'space.jpg';
            var ref = imagesRef.child(fileName);

            // File path is 'images/space.jpg'
            var path = ref.fullPath

            // File name is 'space.jpg'
            var name = ref.name

            // Points to 'images'
            var imagesRef = ref.parent;


            //UPLOAD PHOTO

            //generate a unique id for each photo
            function uidGenerator() {
                return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
                    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
                )
            }

            const photoId = uidGenerator()


            //get firebase user data from local storage
            const userKey = Object.keys(window.localStorage)
                .filter(it => it.startsWith('firebase:authUser'))[0];
            //get all the user info as an object
            const user = userKey ? JSON.parse(localStorage.getItem(userKey)) : undefined;
            //get just the uid of the user
            const uid = user.uid

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

            // Create the file metadata... doesnt work
            var metadata = {
                "photo_id": photoId,

            };

            // Upload blob to the object 'images/mountains.jpg'
            var uploadTask = storageRef.child('images/' + photoId).put(blob, metadata);

            // Listen for state changes, errors, and completion of the upload.
            uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
                function (snapshot) {

                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                    switch (snapshot.state) {
                        case firebase.storage.TaskState.PAUSED: // or 'paused'
                            console.log('Upload is paused');
                            break;
                        case firebase.storage.TaskState.RUNNING: // or 'running'
                            console.log('Upload is running');
                            break;
                    }
                }, function (error) {

                    // A full list of error codes is available at
                    // https://firebase.google.com/docs/storage/web/handle-errors
                    switch (error.code) {
                        case 'storage/unauthorized':
                            // User doesn't have permission to access the object
                            break;

                        case 'storage/canceled':
                            // User canceled the upload
                            break;

                        case 'storage/unknown':
                            // Unknown error occurred, inspect error.serverResponse
                            break;
                    }
                }, function () {
                    // Upload completed successfully, now we can get the download URL
                    var downloadURL = uploadTask.snapshot.downloadURL;


                    // Populate the picData object
                    picData = {
                        "userId": uid,
                        "photoId": photoId,
                        "lat": lat,
                        "long": long,
                        "time": time,
                        "artist": $scope.picInput.artist,
                        "name": $scope.picInput.name,
                        "imgUrl": downloadURL
                    }
                    console.log("Pic upload complete, uploading picData to database....", JSON.stringify(picData))
                    //post data to firebase database
                    CameraFactory.addImg(picData)

                    $scope.srcImage = "../../../img/placeholder.jpg"
                    $scope.picInput = {
                        "artist": "",
                        "name":""
                    }

                    //hide loading spinner
                    $ionicLoading.hide();
                });




        }
    })