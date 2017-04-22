angular.module(app_name)
  .controller('SignUpController', ['$scope', '$location', 'user_service', function($scope, $location, user_service){
 
    if (user_service.is_signed_in()) {
        $location.url('/');
    }

    $scope.sign_up = function() {
      user_service.sign_up({
        "email" : $scope.email, 
        "password" : $scope.password, 
        "password2" : $scope.password2, 
        "username" : $scope.username, 
        "name" : $scope.name
        });
    }

}]);