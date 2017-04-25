angular.module(app_name)
.controller('ProfileController', ['$scope', '$stateParams', 'user_service', '$timeout', 'channel_service',
  function($scope, $stateParams, user_service, $timeout, channel_service){
  var username = $stateParams.username;
  $scope.profile = undefined;

  user_service.get_user_by_username(username)
    .then(function(data){
      $timeout(function () {
        $scope.profile = data;
      });
    });

  $scope.createChannel = function() {
    channel_service.create();
  }

  $scope.$on('USER_LOGGED_IN', function(event, user){
    console.log("SET", user);
  });


}]);