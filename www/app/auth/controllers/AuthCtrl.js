angular.module('app')

.controller("AuthCtrl", function($state, $scope, AuthFactory) {
    $scope.auth = {}

    $scope.logMeIn = function (credentials) {
      AuthFactory.authenticate(credentials).then(function (didLogin) {
          $scope.login = {}
          $scope.register = {}
          $state.go('tabs.dash')
      })
    }
    $scope.logoutUser = function(){
      AuthFactory.logout()
      $state.go('tabs.auth')
  }

    $scope.registerUser = function(registerNewUser) {
      AuthFactory.registerWithEmail(registerNewUser).then(function(didRegister) {
        console.log(didRegister)
      })
    }

  })