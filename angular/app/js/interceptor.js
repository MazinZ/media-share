angular.module(app_name)
.factory("authInterceptor", ['$q', '$window', '$injector',function ($q, $window, $injector) {
  return {
   'request': function(config) {
        if ($window.localStorage.token) config.headers['Authorization'] = 'Token ' + $window.localStorage.token;
        return config;
    },


    'response': function(response) {
        return response;
    },
    'responseError': function(rejection) {
      if (rejection.status == 401 || rejection.status == 400) {
       $injector.get("Notification").error(rejection.data)
      }
      return $q.reject(rejection);
    }
  };
}]);

angular.module(app_name)
.config(function ($httpProvider) {
  $httpProvider.interceptors.push('authInterceptor');
});