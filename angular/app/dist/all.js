var app_name = "media-share";

angular.module(app_name, ['ui.router']);

'use strict';
angular.module(app_name)
    .run(['$http', '$window', '$rootScope', function($http, $window, $rootScope){
        //$http.defaults.xsrfHeaderName = 'X-CSRFToken';
        //$http.defaults.xsrfCookieName = 'csrftoken';
        $http.defaults.headers["Content-Type"] = "application/json";
    }]);
    

angular.module(app_name)
    .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {
 
  /* Config for locationProvider */
  $locationProvider.html5Mode(true);
  $locationProvider.hashPrefix('!');

  //$urlRouterProvider.otherwise('/');
  $stateProvider
    .state('main', {
      views: {
        'nav': {
          templateUrl: '/templates/common/navbar.html',
          controller: 'NavbarController'
        }
      }
    })
    .state('main.index', {
      url: '/',
      views: {
        'content@': {
          template: '<h1> Index </h1>',
        }
      }
    })
    .state('main.sign_in', {
      url: '/login',
      views: {
        'content@': {
        templateUrl: '/templates/users/login.html',
        controller: 'SignInController'
        }
      }
    })
    .state('main.sign_out', {
      url: '/logout',
      views: {
        'content@': {
        template: ' ',
        controller: 'SignOutController'
        }
      }
    })
    .state('main.sign_up', {
      url: '/register',
      views: {
        'content@': {
        templateUrl: '/templates/users/register.html',
        controller: 'SignUpController'
        }
      }
    })
    .state('main.profile', {
      url: '/user/:username',
      views: {
        'content@': {
        templateUrl: '/templates/users/profile.html',
        controller: 'UserProfileController'
        }
      }
    })
    ;

}]);

angular.module(app_name).service('user_service', ['$http', '$location', '$cookies', '$rootScope', '$q', '$window', '$timeout',
    function($http, $location, $cookies, $rootScope, $q, $window, $timeout){
    var self = this;

    self.sign_in = function(user){
        $http({
            method: 'POST',
            url: '/api/v1/auth/login/',
            data: user
        })
        .then(function(data){
            $rootScope.$broadcast("USER_LOGGED_IN");
            set_user(data.data.auth_token);
            $location.url('/');
        });
    };

    self.sign_out = function(){
        $http({
            method: 'POST',
            url: '/api/v1/auth/logout/'
        })
        .then(function(data){
            clear_user();
        });
    };

    self.sign_up = function(user){
        $http({
            method: 'POST',
            url: '/api/v1/auth/register/',
            data: user
        })
        .then(function(data){
            self.sign_in();
        },function(data){
            // handle error
        });
    };

    function is_signed_in() {
        return !!$window.localStorage.token;
    }

    function set_user(token) {
        $window.localStorage.token = token;
        get_current_user().then(function(data){
            $rootScope.$broadcast("USER_SET", data);
        });
    }

    function clear_user(){
      $window.localStorage.removeItem('token');
      $window.localStorage.removeItem('username');        
      $location.url('/');
      $rootScope.$broadcast("USER_CLEARED");
    }

    function get_user(username) {
        return $q(function(resolve, reject) {

        var user_id = null;
        if (is_signed_in()) {
            $http({
                method: 'GET',
                url: '/api/v1/accounts/' + username + '/',
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
        return $q(function(resolve, reject) {

        if (is_signed_in()) {

            $http({
                method: 'GET',
                url: '/api/v1/auth/me/',
            }).then(function(data){
                resolve(data.data);
            }, function(error){
                reject(error);
            });

        }
        else return;
        });
    }

    function get_user_by_username(username) {
        return $q(function(resolve, reject) {
            $http({
                method: 'GET',
                url: '/api/v1/accounts/' + username + '/',
            }).then(function(data){
                resolve(data.data);
            }, function(error){
                reject(error);
            });
        
        });
    }

    self.get_user_by_username = get_user_by_username;
    self.get_user = get_user;
    self.is_signed_in = is_signed_in;
}]);