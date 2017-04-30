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

    function sendSync() {
      socket.emit('sync', {
        'room_name': $scope.channelName,
        'timestamp': $scope.getTimeinSeconds()
      });
    }

    socket.on('request_for_sync', function() {
      sendSync();
    });

    socket.on('set_time_and_play', function(data) {
      $scope.setTime(data.time);
      $scope.play();
    });

    socket.on('connect', function() {
      socket.emit('room', {'room_name': $scope.channelName});
      socket.emit('request_for_sync', {'room_name': $scope.channelName});
      sendSync();
    });

    socket.on('player_changed', function(data) {
      $scope.rec_message = data.message[1];
      if ($scope.rec_message === 1) {
        $scope.play();
      }
      else if ($scope.rec_message === 2) {
        $scope.pause();
      }
    });

}]);
