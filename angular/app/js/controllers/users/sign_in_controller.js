angular.module(app_name)
  .controller('SignInController', ['$scope', '$location', 'user_service', function($scope, $location, user_service){

    if (user_service.is_signed_in()) {
        $location.url('/');
    }

    $scope.sign_in = function() {
      user_service.sign_in({
          "username" : $scope.username, 
          "password" : $scope.password
        });
    }

}]);
