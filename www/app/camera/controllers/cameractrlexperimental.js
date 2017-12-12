// angular.module('app')

//     .controller("CameraCtrl", function ($scope, $cordovaCamera) {

        let b64Img = ""

        $scope.srcImage = {url: ""};

         //utility funct based on https://en.wikipedia.org/wiki/Geographic_coordinate_conversion
         const convertDegToDec = function(arr) {
            return (arr[0].numerator + arr[1].numerator/60 + (arr[2].numerator/arr[2].denominator)/3600).toFixed(4);
        };

        var img = document.getElementById("srcImage");

        img.addEventListener("load", function() {

            console.log("SHIT's GONNA CRASH!")
            EXIF.getData(img, function() {
                console.log("in exif");

                //console.dir(EXIF.getAllTags(img));
                let long = EXIF.getTag(this,"GPSLongitude");
                let lat = EXIF.getTag(this,"GPSLatitude");
                console.log(long,lat)
                long = convertDegToDec(long);
                lat = convertDegToDec(lat);
                // //handle W/S
                // if(EXIF.getTag(img,"GPSLongitudeRef") === "W") long = -1 * long;
                // if(EXIF.getTag(img,"GPSLatitudeRef") === "S") lat = -1 * lat;
                console.log(long,lat);
            });
        }, false);


        $scope.takePhoto = function () {
            // var options = {
            //     quality: 80,
            //     destinationType: Camera.DestinationType.DATA_URL,
            //     sourceType: Camera.PictureSourceType.CAMERA,
            //     allowEdit: true,
            //     encodingType: Camera.EncodingType.JPEG,
            //     targetWidth: 250,
            //     targetHeight: 250,
            //     popoverOptions: CameraPopoverOptions,
            //     saveToPhotoAlbum: false
            // };

            var options = {
                destinationType: Camera.DestinationType.NATIVE_URI,
                sourceType: Camera.PictureSourceType.CAMERA,
            };


            // $cordovaCamera.getPicture(options).then(function (imageData) {
            //     $scope.srcImage = "data:image/jpeg;base64," + imageData;
            //     b64Img = imageData


            // }, function (err) {
            //     // error
            // });

            $cordovaCamera.getPicture(options).then(function(imageURI) {
                console.log('Got image '+imageURI);
                $scope.srcImage.url = imageURI;
                //scope.apply can KMA
                $scope.$apply();
              }, function(err) {
                // error
              });

              $cordovaCamera.cleanup(onSuccess, onFail);

              function onSuccess() {
                  console.log("Camera cleanup success.")
              }

              function onFail(message) {
                  alert('Failed because: ' + message);
              }

        }


        $scope.uploadPhoto = function (photo) {


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

            // Create the file metadata
            var metadata = {
                photo_id: photoId
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


                });
        }
    })