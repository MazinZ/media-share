
angular.module(app_name)
    .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', 
    function($stateProvider, $urlRouterProvider, $locationProvider) {
 
  /* Config for locationProvider */
  $locationProvider.html5Mode(true);
  $locationProvider.hashPrefix('!');

  //$urlRouterProvider.otherwise('/');
  $stateProvider
    .state('index', {
      url: '/',
      views: {
        'content@': {
          template: '<h1> Index </h1>',
        }
      }
    })
    .state('sign_in', {
      url: '/login',
      views: {
        'content@': {
        templateUrl: '/templates/users/sign_in.html',
        controller: 'SignInController'
        }
      }
    })
}]);
