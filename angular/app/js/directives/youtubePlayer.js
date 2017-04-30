// Ref: http://blog.oxrud.com/posts/creating-youtube-directive/
app.directive('youtubePlayer', ['$window', function ($window) {

  return {
    restrict: 'A',
    link: function (scope, element) {
      scope.videoId = 'l6PwOlIMAFw';

      scope.events = {
        'unstarted': -1,
        'ended': 0,
        'playing': 1,
        'paused': 2,
        'buffering': 3,
        'video_cued': 5
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
        var player = new YT.Player(element.attr('id'), {
          height: '390',
          width: '640',
          videoId: scope.videoId,
          events: {
            'onStateChange': onPlayerStateChange
          }
          });
        }

      function onPlayerStateChange(event) {
        console.log(_.filter(_.pairs(scope.events), function(type) {
          return type[1] === event.data;
        })[0]);
      }

    }
  }
}]);