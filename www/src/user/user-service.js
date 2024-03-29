var userModuleService = angular.module('firekitApp.user.services',[]);

userModuleService.service('UserService',['$log', '$q', '$firebaseAuth', 'FBURL', 'User', 'AUTO_ANON', function($log, $q, $firebaseAuth, FBURL, User, AUTO_ANON) {  

  var self, auth, _authObj, currentUser, previousUser, firebaseRef;
  firebaseRef = new Firebase(FBURL);
  _authObj = $firebaseAuth(firebaseRef);
  self = {
    init: function(successCb, errorCb) {
      if (_authObj.$getAuth()) {
        User(_authObj.$getAuth()).then(function(userData){
          currentUser = userData;
          $log.debug("User loaded", currentUser);
        });
      } else {
        if(AUTO_ANON === true) {
          self.loginAnonymously().then(function(authData){
            User(authData).then(function(userData){
              currentUser = userData;
              $log.debug("User loaded", currentUser);
            });
          });
        }
      }
    },
    requireAuth: function () {
      return _authObj.$requireAuth();
    },
    getRef: function() {
      return currentUser.$ref();
    },
    createAndLoginUserWithPassword: function(user, successCb, errorCb){
      self.logout();
      _authObj.$createUser({
        email: user.email,
        password: user.password
      }).then(function(userData) {
        $log.debug("Created user:" + userData.uid);
        return _authObj.$authWithPassword({
          email: user.email,
          password: user.password
        });
      }).then(function(authData) {
        self.init();
        if(successCb) successCb();
      }).catch(function(error) {
        $log.error("Error: ", error);
      });
    },
    loginWithPassword: function(user, successCb, errorCb) {
      self.logout();
      _authObj.$authWithPassword({
        email: user.email,
        password: user.password
      }).then(function(authData) {
        $log.debug("User", authData.uid, "logged in.");
        self.init();
        if(successCb) successCb();
      }).catch(function(error) {
        $log.error("User login failed:", error);
        if(errorCb) errorCb(error);
      });
    },
    loginAnonymously: function() {
      var deferred = $q.defer();
      _authObj.$authAnonymously().then(function(authData) {
        console.debug("User ", authData.uid, " logged in.");
        deferred.resolve(authData);
      }).catch(function(error) {
        console.error("Authenticating anonymous user failed:", error);
        deferred.reject(error);
      });
      return deferred.promise;
    },
    logout: function(successCb, errorCb) {
      if (_authObj.$getAuth()) {
        currentUser.$logout();
        $log.debug("User successfully logged out.");
        if(successCb) successCb();
      } else {
        $log.debug("User tried to logout but is not logged in.");
        if(errorCb) errorCb();
      }
    }
  };
  return self;
}]);