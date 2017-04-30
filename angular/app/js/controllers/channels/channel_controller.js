angular.module(app_name)
.controller('ChannelController', ['$scope', '$stateParams', '$timeout', 'channel_service', 'socket',
  function($scope, $stateParams, $timeout, channel_service, socket){

    $scope.channelName = $stateParams.name;

    $scope.send = function(message) {
      socket.emit('player_changed', {
        'room_name': $scope.channelName, 
        'message': message
      });
    };

    $scope.sendSync = function() {
      socket.emit('sync', {'room_name': $scope.channelName}, '30');
    };

    socket.on('connect', function() {
      socket.emit('room', {'room_name': $scope.channelName});
    });

    socket.on('player_changed', function(data) {
      $scope.rec_message = data.message[1];
      if ($scope.rec_message === 1) {
        $scope.play();
      }
      if ($scope.rec_message === 2) {
        $scope.pause();
      }
    });

}]);
