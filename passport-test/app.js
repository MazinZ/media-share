
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');
var morgan = require('morgan');

mongoose.connect('mongodb://localhost/passporttest');
var db = mongoose.connection;

var users = require('./routes/users');
var channels = require('./routes/channels');

// Init App
var app = express();

// Logger 
app.use(morgan('tiny'));

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Set views folder
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

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

app.use('/api/users', users);
app.use('/api/channels', channels);

//Used for angular
app.get('*', function(req, res) {
      res.sendfile('./views/content.html'); // load the single view file (angular will handle the page changes on the front-end)
  });

// Set Port
app.set('port', (process.env.PORT || 8080));

app.listen(app.get('port'), function(){
	console.log('Server started on port '+app.get('port'));
});