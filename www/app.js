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
  })

  .state('user', {
    url: '/u',
    abstract: true,
    controller: 'UserCtrl',
    templateUrl: "templates/menu.html"
  })
  .state('user.account', {
    url: '',
    views: {
      'menuContent': {
        templateUrl: 'src/user/templates/user.account.html'
      }
    },
    resolve: {
      currentAuth: function(UserService) {
        return UserService.requireAuth();
      }
    }
  })
  .state('user.signup', {
    url: '/signup',
    views: {
      'menuContent': {
        templateUrl: 'src/user/templates/user.signup.html'
      }
    }
  })
  .state('user.login', {
    url: '/login',
    views: {
      'menuContent': {
        templateUrl: 'src/user/templates/user.login.html'
      }
    }
  })
  .state('user.logout', {
    url: '/logout',
    template: '<ui-view/>',
    controller: function($log, $state, UserService) {
      $log.debug("Logging out.");
      UserService.logout();
      $state.go('user.login',{alert: 'You have been logged out.'})
    }
  });

  $urlRouterProvider.otherwise('/u');

});
