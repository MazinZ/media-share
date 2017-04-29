
angular.module(app_name)
    .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', 
    function($stateProvider, $urlRouterProvider, $locationProvider) {
 
  /* Config for locationProvider */
  $locationProvider.html5Mode(true);
  $locationProvider.hashPrefix('!');

  //$urlRouterProvider.otherwise('/');
  $stateProvider
    .state('main', {
      views: {
        'nav': {
          templateUrl: '/templates/partials/navbar.html',
          controller: 'NavbarController'
        }
      }
    })
    .state('main.index', {
      url: '/',
      views: {
        'content@': {
          template: '<h1> Index </h1>',
        }
      }
    })
    .state('main.sign_in', {
      url: '/login',
      views: {
        'content@': {
        templateUrl: '/templates/users/sign_in.html',
        controller: 'SignInController'
        }
      }
    })
    .state('main.sign_up', {
      url: '/register',
      views: {
        'content@': {
        templateUrl: '/templates/users/sign_up.html',
        controller: 'SignUpController'
        }
      }
    })
    .state('main.sign_out', {
      url: '/logout',
      views: {
        'content@': {
        template: ' ',
        controller: 'SignOutController'
        }
      }
    })
    .state('main.profile', {
      url: '/user/:username',
      views: {
        'content@': {
        templateUrl: '/templates/users/profile.html',
        controller: 'ProfileController'
        }
      }
    })
    .state('main.channel', {
      url: '/channel/:name',
      views: {
        'content@': {
        templateUrl: '/templates/channels/channel.html',
        controller: 'ChannelController'
        }
      }
    })
}]);
