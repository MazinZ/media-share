angular.module(app_name)
.controller('ProfileController', ['$scope', '$stateParams', 'user_service', '$timeout',
    function($scope, $stateParams, user_service, $timeout){
    var username = $stateParams.username;
    $scope.profile = undefined;

    user_service.get_user_by_username(username)
      .then(function(data){
        $timeout(function () {
          $scope.profile = data;
        });
      });

  /*function init(user){
    $scope.profile = user;
    console.log("INIT", user);
  }*/

  $scope.$on('USER_LOGGED_IN', function(event, user){
    console.log("SET", user);
  });


}]);