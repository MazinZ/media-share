angular.module(app_name)
  .controller('SignOutController', ['user_service', function(user_service){
    user_service.sign_out();
}]);