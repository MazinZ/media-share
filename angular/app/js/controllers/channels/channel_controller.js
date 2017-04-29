angular.module(app_name)
.controller('ChannelController', ['$scope', '$stateParams', '$timeout', 'channel_service', 'socket',
  function($scope, $stateParams, $timeout, channel_service, socket){

    socket.on('connect', function() {
      socket.emit('room', $stateParams.name);
    });

    socket.on('message', function(data) {
      console.log('Incoming message:', data);
    });

}]);
