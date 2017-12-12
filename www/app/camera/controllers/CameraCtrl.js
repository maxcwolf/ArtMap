angular.module('app')

    .controller("CameraCtrl", function ($scope, $cordovaCamera, $cordovaFile, FileService) {

        let b64Img = ""


        //EXIF DATA FUNCTIONALITY
        //utility funct based on https://en.wikipedia.org/wiki/Geographic_coordinate_conversion
        const convertDegToDec = function (arr) {
            return (arr[0].numerator + arr[1].numerator / 60 + (arr[2].numerator / arr[2].denominator) / 3600).toFixed(4);
        };

        var img = document.getElementById("picTaken");

        img.addEventListener("load", function () {

            console.log("SHIT's GONNA CRASH!")
            EXIF.getData(img, function () {
                console.log("in exif");

                //console.dir(EXIF.getAllTags(img));
                let long = EXIF.getTag(this, "GPSLongitude");
                let lat = EXIF.getTag(this, "GPSLatitude");
                console.log("long is: ", long, "lat is: ", lat)
                long = convertDegToDec(long);
                lat = convertDegToDec(lat);
                // //handle W/S
                // if(EXIF.getTag(img,"GPSLongitudeRef") === "W") long = -1 * long;
                // if(EXIF.getTag(img,"GPSLatitudeRef") === "S") lat = -1 * lat;
                console.log(long, lat);
            });
        }, false);
        ///SIMPLE VERSION OF TAKE PHOTO
        // $scope.takePhoto = function() {
        //     $cordovaCamera.getPicture({
        //         sourceType: Camera.PictureSourceType.CAMERA,       //camera
        //         destinationType: Camera.DestinationType.FILE_URI, //file URI
        //         saveToPhotoAlbum:false,
        //         correctOrientation:true
        //     }).then(function(imageURI) {
        //         $scope.srcImage = imageURI;
        //         console.log($scope.srcImage)
        //     }, function(err) {
        //         alert('An error has occured');
        //     });
        //   };

        // //// MORE COMPLEX VERSION OF TAKE PHOT
        // //// copies the file to the cordova.file.dataDirectory
        $scope.srcImage = "";
        $scope.takePhoto = function () {
            var options = {
                quality: 50,
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: Camera.PictureSourceType.CAMERA,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 350,
                targetHeight: 400,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false,
                correctOrientation: true
            };

            // $cordovaCamera.getPicture(options).then(function (imageData) {
            //     $scope.srcImage = "data:image/jpeg;base64," + imageData;
            // })

            $cordovaCamera.getPicture(options).then(function (sourcePath) {
                var sourceDirectory = sourcePath.substring(0, sourcePath.lastIndexOf('/') + 1);
                var sourceFileName = sourcePath.substring(sourcePath.lastIndexOf('/') + 1, sourcePath.length);

                console.log("Copying from : " + sourceDirectory + sourceFileName);
                console.log("Copying to : " + cordova.file.dataDirectory + sourceFileName);
                $cordovaFile.copyFile(sourceDirectory, sourceFileName, cordova.file.dataDirectory, sourceFileName).then(function(fileEntry) {
                    console.log(JSON.stringify(fileEntry))


                    //         //     const path = cordova.file.dataDirectory + sourceFileName;
                    $scope.srcImage = cordova.file.dataDirectory + sourceFileName;

                    $scope.srcImage = sourcePath
                    $scope.apply()


                }, function(error) {
                   console.dir(JSON.stringify(error));
                });

            }, function (err) {
                console.log("get Picture error: ", JSON.stringify(err));
            });
        }


        // function readBinaryFile(fileEntry) {

        //     window.resolveLocalFileSystemURL(fileEntry, function (entry) {

        //         entry.file(function (file) {
        //             var reader = new FileReader();

        //             reader.onloadend = function () {

        //                 console.log("Successful file write: " + this.result);
        //                 displayFileData(entry.fullPath + ": " + this.result);

        //                 var blob = new Blob([new Uint8Array(this.result)], { type: "image/png" });
        //                 $scope.srcImage = window.URL.createObjectURL(blob);
        //             };

        //             reader.readAsArrayBuffer(file);

        //         }, onErrorReadFile);
        //     })
        // }


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




        // ///// MOST COMPLEX TAKEPHOTO... adds unique ID and copies to app storage
        // $scope.takePhoto = function () {
        //     // var options = {
        //     //     destinationType: Camera.DestinationType.FILE_URI,
        //     //     sourceType: Camera.PictureSourceType.CAMERA,
        //     // };

        //     var options = {
        //         quality: 100,
        //         destinationType: Camera.DestinationType.FILE_URI,
        //         sourceType: Camera.PictureSourceType.CAMERA,
        //         allowEdit: true,
        //         encodingType: Camera.EncodingType.JPEG,
        //         // targetWidth: 250,
        //         // targetHeight: 250,
        //         popoverOptions: CameraPopoverOptions,
        //         saveToPhotoAlbum: false
        //     };

        //         $cordovaCamera.getPicture(options).then(function(imageData) {
        //             onImageSuccess(imageData);
        //             //1
        //             function onImageSuccess(fileURI) {
        //                 console.log("#1 running onImageSuccess")
        //                 createFileEntry(fileURI);
        //             }
        //             //2
        //             function createFileEntry(fileURI) {
        //                 console.log("#2 running creatFileEntry")
        //                 window.resolveLocalFileSystemURL(fileURI, copyFile, fail);
        //             }

        //             //5 //file entry in the object...
        //             //{"isFile":true,
        //             //"isDirectory":false,
        //             //"name":"cdv_photo_001.jpg",
        //             //"fullPath":"/cdv_photo_001.jpg",
        //             //"filesystem":"<FileSystem: temporary>",
        //             //"nativeURL":"file:///var/mobile/Containers/Data/Application/63277060-18F4-435F-A2CA-5826A48FEECC/tmp/cdv_photo_001.jpg"}
        //             function copyFile(fileEntry) {
        //                 console.log("#5 running copyFile")
        //                 var name = fileEntry.fullPath.substr(fileEntry.fullPath.lastIndexOf('/') + 1);
        //                 console.log("name:  ", name);
        //                 console.log("fileEntry is... ", JSON.stringify(fileEntry))
        //                 console.log("fileEntry.fullPath:  ", fileEntry.fullPath);
        //                 var newName = makeid() + name;
        //                 console.log(newName)

        //                 window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(fileSystem2) {
        //                         console.log("#6 running resolveLocalFileSytem....")
        //                         fileEntry.copyTo(
        //                             fileSystem2,
        //                             newName,
        //                             onCopySuccess,
        //                             fail
        //                         );
        //                     },
        //                     fail);
        //             }

        //             //6
        //             function onCopySuccess(entry) {
        //                 console.log("#6 running onCopySuccess")
        //                 $scope.$apply(function() {

        //                     console.log("This is what is going in the $scope.img (entry.nativeURL)...", entry.nativeURL);

        //                     // Display your captured image in the <img> tag**

        //                     $scope.urlImg = entry.nativeURL;
        //                     /**
        //                             window.localStorage.setItem('images', JSON.stringify($scope.images));

        //                                  and to get the data:

        //                                   var data = window.localStorage.getItem('images');
        //                                             var array = angular.fromJson(data); **/




        //                 });
        //             }

        //             function fail(error) {
        //                 console.log("fail: " + error.code);
        //             }

        //             function makeid() {
        //                 var text = "";
        //                 var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        //                 for (var i = 0; i < 5; i++) {
        //                     text += possible.charAt(Math.floor(Math.random() * possible.length));
        //                 }
        //                 return text;
        //             }

        //         }, function(err) {
        //             console.log(err);
        //         });

        //     }

        // $scope.urlForImage = function(imageName) {
        //     var name = imageName.substr(imageName.lastIndexOf('/') + 1);
        //     var trueOrigin = cordova.file.dataDirectory + name;
        //     return trueOrigin;
        // }



        // FileService.convertFileUriToInternalURL(imageData).then(function(cordovaUri) {
        //            $scope.srcImage = cordovaUri;

        //            console.log($scope.srcImage)
        //        });

        // $cordovaFile.resolveLocalFilesystemUrl(nativePath, function(imageURI) {
        //     console.log('cdvfile URI: ' + imageURI.toInternalURL())
        // })
        // $cordovaFile.resolveLocalFilesystemUrl(imageURI).then(function(p) {
        //     console.log('$cordovaFile promise is...',JSON.stringify(p))
        // })
        // relativeUri = '/' + fileUri.replace(cordova.file.applicationStorageDirectory, '')
        // console.log(relativeUri)
        // imageFileName = imageURI.substr(imageURI.lastIndexOf('/') + 1) + '';




        // console.log('Got image '+imageURI);
        // $scope.srcImage.url = imageURI;
        // console.log(JSON.stringify($scope.srcImage))

        //scope.apply can KMA
        //         $scope.$apply()

        //     }, function(err) {
        //         console.log('there was an error in $apply', err)
        //     });
        //     // $cordovaCamera.getPicture(options).then(function (imageData) {
        //     //     $scope.srcImage = "data:image/jpeg;base64," + imageData;
        //     //     b64Img = imageData
        //     //     console.log($scope.srcImage)
        //     // }, function (err) {
        //     //     // error
        //     // });
        // }


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