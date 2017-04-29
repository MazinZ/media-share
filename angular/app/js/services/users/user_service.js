angular.module(app_name).service('user_service', 
['$http', '$location', '$rootScope', '$q', '$window', '$timeout', '$cookies',
    function($http, $location, $rootScope, $q, $window, $timeout, $cookies){
    var self = this;

    self.user = null;
  
    self.sign_in = function(user){
      $http({
        method: 'POST',
        url: '/api/users/login/',
        data: user
      })
      .then(function(data){
        set_user();
        $location.url('/user/' + data.data);
      });
    };

    self.sign_out = function(){
      $http({
        method: 'GET',
        url: '/api/users/logout/'
      })
      .then(function(data){
        clear_user();
      });
    };

    self.sign_up = function(user){
      $http({
        method: 'POST',
        url: '/api/users/register/',
        data: user
      })
      .then(function(data){
        self.sign_in();
      });
    };

    function is_signed_in() {
      return !!$cookies.get('ms_cookie');
    }

    function set_user() {
      $cookies.put('ms_cookie', JSON.stringify(new Date()));
      get_current_user().then(function(data){
        self.user = data.data;
        $rootScope.$broadcast("USER_SET", data);
      });
    }

    function clear_user(){
      $cookies.remove('ms_cookie');
      $location.url('/');
      $rootScope.$broadcast("USER_CLEARED");
    }

    function get_user(username) {
      return $q(function(resolve, reject) {

      var user_id = null;
      if (is_signed_in()) {
        $http({
            method: 'GET',
            url: '/api/users/' + username + '/',
        }).then(function(data){
            resolve(data.data);
        }, function(error){
            reject(error);
        });
      }
      else return;
      });
    }

    function get_current_user() {
      return $http({
        method: 'GET',
        url: '/api/users/me/',
      });
    }

    function get_user_by_username(username) {
      return $q(function(resolve, reject) {
        $http({
          method: 'GET',
          url: '/api/users/' + username + '/',
        }).then(function(data){
          resolve(data.data);
        }, function(error){
          reject(error);
        });
      });
    }

    self.get_user_by_username = get_user_by_username;
    self.get_user = get_user;
    self.get_current_user = get_current_user;
    self.is_signed_in = is_signed_in;
    self.set_user = set_user;
}]);