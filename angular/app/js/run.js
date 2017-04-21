'use strict';
angular.module(app_name)
    .run(['$http', '$window', '$rootScope', function($http, $window, $rootScope){
        //$http.defaults.xsrfHeaderName = 'X-CSRFToken';
        //$http.defaults.xsrfCookieName = 'csrftoken';
        $http.defaults.headers["Content-Type"] = "application/json";
    }]);
    