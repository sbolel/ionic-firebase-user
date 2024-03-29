angular.module('firekitApp', [
  'ionic',
  'firebase',
  'ngMaterial',
  'firekitApp.user',
  'firekitApp.config',
  ])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: '/',
    templateUrl: "templates/menu.html"
  });

  $urlRouterProvider.otherwise('/u');

});
