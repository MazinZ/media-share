var express = require('express');
var expressValidator = require('express-validator');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var passportSocketIo = require('passport.socketio');
var _ = require('lodash');

mongoose.connect('mongodb://localhost/backend-server');
var db = mongoose.connection;

var sessionStore = new MongoStore({url:'mongodb://127.0.0.1/'});

// var index = require('./routes/index');
// var users = require('./routes/users');

var users = require('./routes/users');
var channels = require('./routes/channels');

var app = express();

var server = require('http').createServer(app);
var io = require('socket.io')(server)

io.use(passportSocketIo.authorize({
  key: 'connect.sid',
  secret: 'secret',
  passport: passport,
  store: sessionStore,
  cookieParser: cookieParser,
  success: onAuthorizeSuccess,
  fail: onAuthorizeFail,
}));

var rooms = {};
var sync_channel = {};

io.on('connection', (socket) => {
  console.log('client connected');
  socket.on('test-event', (data) => {
    if (socket.request.user && socket.request.user.logged_in) {
      console.log('authenticated event')
      console.log(socket.request.user);
    } else {
      console.log('not authenticated event');
    }
  });

  socket.on('room', function (data) {
    console.log('client joined room: ' + data.room_name);
    socket.join(data.room_name);
    rooms[data.room_name] = {
      state: 0
    };
    sync_channel[data.room_name] = {
        count: 0,
        timestamps: []
      };
  });
  
  socket.on('player_changed', function(data){
    console.log('player_changed on room: ' + data.room_name);
    rooms[data.room_name].state = data.message;
    socket.to(data.room_name).emit('player_changed', data);
  });
  
  /*
  Ideas behind Syncing.
  - When a client joins they send a requestSync event, then a sync event with their timestamp in it.
  - Server receives this event and broadcasts requestSync to all other clients.
  - After clients recieve a requestSynce they emit a sync event to server with their timestamp in it.
  - After server has receieved all syncs from each socket in a room, the server emits a setTimeAndPlay
    event to the clients notifying them what time they should play the video at and to start immediately.

  [Future improvements to algorithm]
  - send setTime event then wait for all clients to response they are ready and have buffered a little ahead of time specified.
  - then after clients send ready event server sends back event telling them all to start.

  [Alternative algorithm]
  - Client constantly send time they are at while playing video every specified time interval.
  - Server averages times together and if client is ever off by 2 or more seconds, server tells that client the average video time to set their player to.
  */

  socket.on('request_for_sync', (data) => {
    console.log("recieved request_for_sync")
    socket.broadcast.emit('request_for_sync');
  });

  socket.on('sync', (data) => {
    console.log("recieved sync")
    console.log('sync channel before');
    console.log(sync_channel);
    var room = data.room_name;
    var timestamp = data.timestamp;
    var state = data.state;
    if(!(room in sync_channel)){
      sync_channel[room] = {
        count: 0,
        timestamps: [],
        states: []
      };
    }
    sync_channel[room].count++;
    sync_channel[room].timestamps.push(timestamp);
    sync_channel[room].timestamps.push(state);
    // console.log('sync channel2');
    // console.log(sync_channel);
    var cinroom = NumClientsInRoom('/', room);
    console.log(cinroom);
    console.log('sync channel after');
    console.log(sync_channel);
    if(sync_channel[room].count >= cinroom){
      console.log('emitting setTimeAndPlay');
      var max_index = 0;
      for(i=0; sync_channel[room].timestamps; i++){
        if(sync_channel[room].timestamps[max_index] < sync_channel[room].timestamps[i]){
          max_index = i;
        }
      }
      // console.log({setTime: _.max(sync_channel[room].timestamps)});

      io.to(room).emit('set_time_and_play', {
        // time: _.max(sync_channel[room].timestamps),
        time: sync_channel[room].timestamps[max_index],
        state: sync_channel[room].states[max_index]
      });
      //reset room
      sync_channel[room].count = 0;
      sync_channel[room].timestamps = [];
      sync_channel[room].states = [];
    }
  });

  socket.on('disconnect', function () {
    console.log('recieved disconnect');
    // console.log(socket.rooms);
    //   socket.rooms.forEach(function(room){
    //      io.in(room).emit('user:disconnect', {id: socket.id});
    //  });
  });

});

function NumClientsInRoom(namespace, room) {
  var clients = io.nsps[namespace].adapter.rooms[room];
  return clients.length;
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//socket io middleware (attaches io to res object)
app.use(function(req, res, next){
  res.io = io;
  next();
});

// Express Session
app.use(session({
    key: 'connect.sid',
    store: sessionStore,
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

function onAuthorizeSuccess(data, accept){
  accept();
};

function onAuthorizeFail(data, msg, err, accept){
  accept();
};

// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', index);
// app.use('/users', users);

app.use('/api/users', users);
app.use('/api/channels', channels);

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

//Used for angular
app.get('*', function(req, res) {
    res.sendfile('./views/content.html'); // load the single view file (angular will handle the page changes on the front-end)
});

module.exports = {app:app, server:server};
