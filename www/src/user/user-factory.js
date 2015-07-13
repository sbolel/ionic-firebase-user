var userModuleFactory = angular.module('firekitApp.user.factories',[]);

userModuleFactory.factory('User',['$log', '$q', '$rootScope', 'UserFactory', 'FBURL', function($log, $q, $rootScope, UserFactory, FBURL){
  var userData;
  return function(userAuth){
    var deferred = $q.defer();
    if(userAuth.uid){
      var userRef = new Firebase(FBURL+'/users/'+userAuth.provider+'/'+userAuth.uid);
      userData = new UserFactory(userRef);
      $log.debug("Current user:", userData.$id);
      userData.$updateUser();
      userData.$bindTo($rootScope, "userData").then(function() {
        $rootScope.auth = userData.$auth.$getAuth();
        deferred.resolve(userData);
      });
    } else {
      $log.error("User factory did not receive user authentication data.");
      deferred.reject("User(userAuth) - userAuth not inputted.");
    }
    return deferred.promise;
  }
}]);

userModuleFactory.factory('UserFactory', ['$rootScope', '$firebaseAuth', '$firebaseObject', '$q', 'FBURL', function($rootScope, $firebaseAuth, $firebaseObject, $q, FBURL){
  var ref = new Firebase(FBURL);
  return $firebaseObject.$extend({
    $$defaults: {
      $auth: $firebaseAuth(ref),
    },
    $updateUser: function() {
      var deferred = $q.defer();
      var authDetails = {};
      angular.copy(this.$auth.$getAuth(), authDetails);
      delete authDetails.auth;
      this.auth = authDetails;
      if (authDetails.password) {
        this.auth.email = authDetails.password.email;
      }
      this.$ref().update(this.auth, function(error){
        if(error){
          deferred.reject(error);
        } else {
          deferred.resolve();
        }
      });
      return deferred.promise;
    },
    $connectPreviousSession: function(previousSession) {
      this.$ref().child('previousSession').push(previousSession);
    },
    $logout: function() {
      this.$destroy();
      this.$auth.$unauth();
    }
  });
}]);
