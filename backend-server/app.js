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

io.on('connection', function (socket) {
  socket.on('room', function (room) {
    console.log('client joined room: ' + room);
    socket.join(room);
  });
});

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
  socket.on('room', function (room) {
    console.log('client joined room: ' + room);
    socket.join(room);
  });
});

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
