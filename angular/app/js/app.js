var app_name = "media-share";

angular.module(app_name, 
['ui.router', 'ui-notification', 'angular-loading-bar', 'ngAnimate']);

angular.module('notification', ['ui-notification'])
  .config(function(NotificationProvider) {
    NotificationProvider.setOptions({
        delay: 10000,
        startTop: 20,
        startRight: 10,
        verticalSpacing: 20,
        horizontalSpacing: 20,
        positionX: 'right',
        positionY: 'bottom',
        closeOnClick: false
    });
  });