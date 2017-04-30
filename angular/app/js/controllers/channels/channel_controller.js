angular.module(app_name)
.controller('ChannelController', ['$scope', '$stateParams', '$timeout', 'channel_service', 'socket',
  function($scope, $stateParams, $timeout, channel_service, socket){

    $scope.channelName = $stateParams.name;

    $scope.send = function(message) {
      socket.emit('player_changed', {
        'room_name': $stateParams.name, 
        'message': message
      });
    };

    socket.on('connect', function() {
      socket.emit('room', {'room_name': $stateParams.name});
    });

    socket.on('played_changed', function(message) {
      console.log(message);
    });

}]);
