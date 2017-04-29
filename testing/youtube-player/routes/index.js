var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/', (req, res) => {
  console.log('post called on /');
  console.log(req.body);
  var control = req.body.control;
  if(control == 'pause'){
    console.log('emitting pause');
    res.io.to('room1').emit('pause');
  }
  if(control == 'play'){
    console.log('emitting play');
    res.io.to('room1').emit('play');
  }
  res.end();
});

router.post('/getCurrentTime', (req, res) => {
  console.log('post called on /getCurrentTime');
  console.log(req.body);
  res.io.to('room1').emit('getCurrentTime');
  res.end();
});

router.post('/setCurrentTime', (req, res) => {
  console.log('post called on /setCurrentTime');
  console.log(req.body);
  var time = req.body.time;
  res.io.to('room1').emit('setCurrentTime', {time: time});
  res.end();
});

module.exports = router;
