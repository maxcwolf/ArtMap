angular.module('app')

  .controller("AuthCtrl", function ($state, $scope, AuthFactory, $ionicModal) {
    $scope.auth = {}

    $scope.logMeIn = function (credentials) {
      console.log(credentials)
      AuthFactory.postUser(credentials).then(res => {
        console.log(res)
        if (localStorage.getItem("token") !== null) {
          $scope.login = {}
          $scope.register = {}
          $state.go('tabs.dash')
        }
      })
      // AuthFactory.getUser(credentials).then(function (didLogin) {
      //     $scope.login = {}
      //     $scope.register = {}
      //     $state.go('tabs.dash')
      // })
    }

    $scope.logoutUser = function () {
      AuthFactory.logout()
      // $state.go('auth')
    }

    $scope.registerUser = function (auth) {
      AuthFactory.postUser(auth).then(res => {

      })
    }

    // $scope.registerUser = function(registerNewUser) {
    //   AuthFactory
    //     .registerWithEmail(registerNewUser)
    //     .then(function(){
    //       AuthFactory.updateProfile($scope.auth)
    //     })

    // }

    $ionicModal.fromTemplateUrl('app/auth/partials/modal-reg.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.modal = modal;
    });
    $scope.openModal = function () {
      $scope.modal.show();
    };
    $scope.closeModal = function () {
      $scope.modal.hide();
    };
    // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function () {
      $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function () {
      // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function () {
      // Execute action
    });

  })