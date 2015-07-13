var userModule = angular.module('firekitApp.user',[
  'firekitApp.user.config', 
  'firekitApp.user.factories', 
  'firekitApp.user.services'
]);

userModule.run(['$rootScope', 'UserService', function($rootScope, UserService) {
  UserService.init();
}]);

userModule.controller('UserCtrl', ['$log', '$scope', '$state', 'UserService', function($log, $scope, $state, UserService) {

  var showAccountErrorAlert = function() {
    alert("Oops, we couldn't log you in.");
  }

  var showMissingInputAlert = function(){
    alert("Please enter your email and password to log in.");
  }

  $scope.incomingUser = {};

  $scope.loginWithPassword = function() {
    if($scope.incomingUser.email && $scope.incomingUser.password) {
      UserService.loginWithPassword($scope.incomingUser, function() {
        $state.go('user.account');
      }, function(error){
        $log.error("Login error:",error);
        showAccountErrorAlert();
      });
    } else {
      showMissingInputAlert();
    }
  };

  $scope.signupWithPassword = function() {
    if($scope.incomingUser.email && $scope.incomingUser.password) {
      UserService.createUser($scope.incomingUser, function() {
        // $state.go('workspace.listings.map');
      }, function(error){
        $log.error("Signup error:",error);
        showAccountErrorAlert();
      });
    } else {
      showMissingInputAlert();
    }
  };

}]);

