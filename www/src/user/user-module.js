var userModule = angular.module('firekitApp.user',[
  'firekitApp.user.config', 
  'firekitApp.user.factories', 
  'firekitApp.user.services'
]);

userModule.constant('AUTO_ANON', true);

userModule.run(['$rootScope', 'UserService', function($rootScope, UserService) {
  UserService.init();
}]);

userModule.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  $stateProvider
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
}]);

userModule.controller('UserCtrl', ['$log', '$scope', '$state', '$ionicPopup', 'UserService', function($log, $scope, $state, $ionicPopup, UserService) {

  var showAccountErrorAlert = function(errorObj) {
    var alertPopup = $ionicPopup.alert({
      title: 'Sorry!',
      template: 'The email/password combination is incorrect'
    });
    alertPopup.then(function(res) {
      $log.error("Login error:",errorObj);
    });
  }

  var showMissingInputAlert = function(errorObj){
    alert("Please enter your email and password to log in.");
    var alertPopup = $ionicPopup.alert({
      title: 'Oops!',
      template: 'Please enter both an email and password.'
    });
    alertPopup.then(function(res) {
      $log.error("Login error:",errorObj);
    });
  }

  $scope.incomingUser = {};

  $scope.loginWithPassword = function() {
    if($scope.incomingUser.email && $scope.incomingUser.password) {
      UserService.loginWithPassword($scope.incomingUser, function() {
        // success, go to account
        $state.go('user.account');
      }, function(error){
        showAccountErrorAlert(error);
      });
    } else {
      showMissingInputAlert();
    }
  };

  $scope.signupWithPassword = function() {
    if($scope.incomingUser.email && $scope.incomingUser.password) {
      UserService.createAndLoginUserWithPassword($scope.incomingUser, function() {
        // success, go to account
        $state.go('user.account');
      }, function(error){
        showAccountErrorAlert(error);
      });
    } else {
      showMissingInputAlert();
    }
  };

}]);

