angular
  .module("app")

  .controller("CameraCtrl2", function(
    $scope,
    $cordovaCamera,
    $cordovaFile,
    $cordovaGeolocation,
    FileService,
    CameraFactory,
    $ionicLoading,
    API
  ) {
    //allow the map to be shown when changing back to the map state
    $scope.showMap = true;

    let b64data = "";

    //create scoped object for any text fields on picture
    $scope.picInput = {
      artist: "",
      name: ""
    };

    let lat = "";
    let long = "";
    let time = "";

    // TAKE PHOTO
    // create an empty variable for the image to be temporarily stored for display and upload
    $scope.srcImage = "";
    $scope.takePhoto = function() {
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
      //run the cordova camera function to capute the picture and display it
      $cordovaCamera.getPicture(picOptions).then(function(imageData) {
        $scope.srcImage = "data:image/jpeg;base64," + imageData;
        b64data = imageData;
      });

      const geoOptions = {
        enableHighAccuracy: true
      };

      //get the location of the photo
      $cordovaGeolocation
        .getCurrentPosition(geoOptions)
        .then(function(position) {
          console.log(JSON.stringify(position));
          lat = position.coords.latitude;
          long = position.coords.longitude;
          time = position.timestamp;
        });
    };

    //UPLOAD PHOTO
    $scope.uploadPhoto = function(photo) {
      //show loading spinner
      $ionicLoading.show();

      //generate a unique id for each photo
      function uidGenerator() {
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
          (
            c ^
            (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
          ).toString(16)
        );
      }

      //store the uuid in the photoId variable
      const photoId = uidGenerator();

      //upload the base64 image to the api
      CameraFactory.addImgData(b64data, photoId);

      //recreate the filepath of the image
      const photoPath = `${API.URL}/images/${photoId}.jpg`;

      //get the current user to pass in to the post post
      const token = JSON.parse(localStorage.getItem("token"))
      const uid = token.UserId

      console.log("uid is...", uid, "     and title is...", $scope.picInput.title)

      //store all the data for the post model in this object to send in the addImg factory function
      const picData = {
        userId: uid,
        photoId: photoId,
        lat: lat,
        long: long,
        artist: $scope.picInput.artist,
        title: $scope.picInput.title,
        photoURI: photoPath
      };

      console.log(JSON.stringify(picData))

      //add the post data to the db
      CameraFactory.addImg(picData);

      //reset the view and form fields
      $scope.srcImage = "../../../img/placeholder.jpg";
      $scope.picInput = {
        artist: "",
        name: ""
      };

      //hide loading spinner
      $ionicLoading.hide();
    };
  });
