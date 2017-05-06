angular.module(app_name)
.controller('ChannelController', ['$scope', '$stateParams', '$timeout', 'channel_service', 'socket',
  function($scope, $stateParams, $timeout, channel_service, socket){

    $scope.channelName = $stateParams.name;
    $scope.ready = false;

    $scope.$watch('ready', function(newVal, oldVal){
      console.log(newVal)
      if (newVal) {
        socket.emit('room', {'room_name': $scope.channelName});
        socket.emit('request_for_sync', {'room_name': $scope.channelName});
        sendSync();
      }
    });

    $scope.send = function(message) {
      socket.emit('player_changed', {
        'room_name': $scope.channelName, 
        'message': message
      });
    };

    function sendSync() {
      if (!$scope.getTimeinSeconds) {
        return;
      }
      socket.emit('sync', {
        'room_name': $scope.channelName,
        'timestamp': $scope.getTimeinSeconds()
      });
    }

    socket.on('request_for_sync', function() {
      sendSync();
    });

    socket.on('set_time_and_play', function(data) {
      $scope.stop();
      $scope.setTime(data.setTime);
      /*$timeout(function(){
        $scope.play();
        console.log("PRE");
      }, 3000);
      console.log("POST");*/
    });

    /*socket.on('connect', function() {
      socket.emit('room', {'room_name': $scope.channelName});
      socket.emit('request_for_sync', {'room_name': $scope.channelName});
      sendSync();
    });*/

    socket.on('player_changed', function(data) {
      console.log("DATA", data);
      $scope.rec_message = data.message;
      console.log("NEWMESSAGE", $scope.rec_message);
      if ($scope.rec_message === 1) {
        $scope.play();
      }
      else if ($scope.rec_message === 2) {
        $scope.pause();
      }
      else if ($scope.rec_message === 3) {
        console.log("Buffering...");
      }
    });
}]);
