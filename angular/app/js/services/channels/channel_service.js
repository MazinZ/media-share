angular.module(app_name).service('channel_service', ['$http', '$location', '$q', '$window', '$timeout',
    function($http, $location, $q, $window, $timeout) {
    var self = this;

    self.create = function(){
      $http({
        method: 'POST',
        url: '/api/channels/',
      })
      .then(function(data){
        $location.url('/channel/' + data.data.channelName);
      });
    };

    

}]);