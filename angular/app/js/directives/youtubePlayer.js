// Ref: http://blog.oxrud.com/posts/creating-youtube-directive/
app.directive('youtubePlayer', ['$window', 'socket', function ($window, socket) {

  return {
    restrict: 'A',
    scope: '=',
    link: function (scope, element) {
      scope.videoId = 'l6PwOlIMAFw';
      scope.message = ['unstarted', -1];
  
      scope.events = {
        'unstarted': -1,
        'ended': 0,
        'playing': 1,
        'paused': 2,
        'buffering': 3,
        'video_cued': 5
      };


      scope.play = function() {
        scope.player.playVideo();
      };

      scope.pause = function() {
        scope.player.pauseVideo();
      };


      if (!YT) {
        $window.onYouTubePlayerAPIReady = onPlayerReady;
      }
      else if (YT.loaded) {
        onPlayerReady();
      }
      else {
        YT.ready(onPlayerReady);
      }

      function onPlayerReady() {
        scope.player = new YT.Player(element.attr('id'), {
          height: '390',
          width: '640',
          videoId: scope.videoId,
          events: {
            'onStateChange': onPlayerStateChange
          }
          });
        }

      function onPlayerStateChange(event) {
        scope.message = _.filter(_.pairs(scope.events), function(type) {
          return type[1] === event.data;
        })[0];
        scope.send(scope.message);
      }

    }
  }
}]);