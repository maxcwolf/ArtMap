angular.module('app', ['ionic', 'ionic.native'])

  .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider, $compileProvider) {
    //maybe gets images sanitized?
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|file|blob|cdvfile|content|tel|geo|mailto|sms|market):|data:image\//);

    //PUSHES TABS BAR TO THE BOTTOM OF THE PAGE
    $ionicConfigProvider.tabs.position('bottom'); // other values: top

    //TAB NAV BAR STATES
    $stateProvider
      .state('auth', {
        url: "/auth",
        templateUrl: "app/auth/partials/tab-auth.html",
        controller: 'AuthCtrl'
      })
      .state('tabs', {
        url: "/tab",
        abstract: true,
        templateUrl: "templates/tabs.html"
      })
      .state('tabs.dash', {
        url: "/dash",
        views: {
          'tab-dash': {
            templateUrl: "app/dash/partials/tab-dash.html",
            controller: 'DashCtrl',
            authRequired: 'true'
            // resolve: { isAuth }
          }
        }
      })
      .state('tabs.camera', {
        url: "/camera",
        views: {
          'tab-camera': {
            templateUrl: "app/camera/partials/tab-camera.html",
            controller: 'CameraCtrl',
            authRequired: 'true'
            // resolve: { isAuth }
          }
        }
      })
      //   .state('tabs.map-detail', {
      //   url: '/map/:mapId',
      //   views: {
      //     'tab-map': {
      //       templateUrl: 'templates/map-detail.html',
      //       controller: 'MapDetailCtrl'
      //     }
      //   }
      // })

      .state('tabs.map', {
        url: "/map",
        views: {
          'tab-map': {
            templateUrl: "app/map/partials/tab-map.html",
            controller: 'MapCtrl',
            authRequired: 'true'
          }
        }
      });

    //if no url is specified, bring to auth tab
    $urlRouterProvider.otherwise("/auth");

  })