var express = require('express');
var http = require('http');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var session = require('express-session');
var redisStore = require('connect-redis')(session);
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');
var morgan = require('morgan');
var socketio = require('socket.io');
var passportSocketIo = require('passport.socketio');

mongoose.connect('mongodb://localhost/passporttest');
var db = mongoose.connection;
var User = require('./models/user');

var sessionStore = new redisStore();

var app = express();
var server = http.Server(app);
var io = socketio(server);

io.use(passportSocketIo.authorize({
  key: 'connect.sid',
  secret: 'secret',
  passport: passport,
  store: sessionStore,
  cookieParser: cookieParser,
  success: onAuthorizeSuccess,
  fail: onAuthorizeFail,
}));

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
});

// Logger 
// app.use(morgan('tiny'));

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.getUserByUsername(username, function(err, user){
        if(err) throw err;
        if(!user){
            return done(null, false, {message: 'Unknown User'});
        }
        User.comparePassword(password, user.password, function(err, isMatch){
            if(err) throw err;
            if(isMatch){
                console.log("Success");
                return done(null, user);
            } else {
                return done(null, false, {message: 'Invalid password'});
            }
        });
    });
  }));

passport.serializeUser(function(user, done) {
    console.log("Serializing");
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    console.log("Deserializing");
    User.getUserById(id, function(err, user) {
        done(err, user);
    });
});


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

// Register User
app.post('/register', function(req, res){
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;

	// Validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();

	if(errors){
        res.send({errors: errors});
	} else {
		var newUser = new User({
			name: name,
			email:email,
			username: username,
			password: password
		});

		User.createUser(newUser, function(err, user){
			if(err) throw err;
			console.log(user);
		});

		// req.flash('success_msg', 'You are registered and can now login');

		// res.redirect('/users/login');
        res.send("Succes created user: " + newUser.name);
	}
});

app.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        console.log(info);
        if (err) { 
            // return next(err); 
            res.status(500);
            res.send("Error occured");
        }
        if (!user) { 
            res.status(401);
            return res.send(info.message) 
        }
        req.logIn(user, function(err) {
            if (err) { return next(err); }
            return res.send(user.username);
        });
    })(req, res, next);
});

app.get('/isloggedin', function(req, res){
  if(req.isAuthenticated()){
    res.send("Yes");
	} else {
		//req.flash('error_msg','You are not logged in');
	  res.send("No");
	}
});

app.get('/logout', function(req, res){
  req.logout();
  res.send("Logged out");
});

app.get('*', function(req, res) {
  res.render('index.html');
});

server.listen(8080, function(){
	console.log('Server started on port 8080');
});