angular.module(app_name).controller('NavbarController', ['$scope', '$rootScope', '$timeout', '$window', 'user_service',
  function ($scope, $rootScope, $timeout, $window, user_service) {

  if (!user_service.user && user_service.is_signed_in()) {
    user_service.set_user();
  }

  $rootScope.$on('USER_SET', function(event, user){
    init(user);
  });

  $rootScope.$on('USER_CLEARED', function(event, user){
    $scope.username = null;
  });

  function init() {
    $timeout(function() {
      $scope.user = user_service.user;
      $scope.username = $scope.user.username;
    });
  }

}]);