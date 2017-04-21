var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');

// Register
router.get('/register', function(req, res){
    // Render register screen
	// res.render('register');
    res.render('content');
});

// Login
router.get('/login', function(req, res){
    // Render login screen
	// res.render('login');
});

// Register User
router.post('/register', function(req, res){
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

passport.use(new LocalStrategy(
  function(username, password, done) {
    // console.log("Authenticating");
    // console.log(username);
    User.getUserByUsername(username, function(err, user){
        if(err) throw err;
        if(!user){
            // console.log("Unknown User");
            return done(null, false, {message: 'Unknown User'});
        }
        User.comparePassword(password, user.password, function(err, isMatch){
            if(err) throw err;
            if(isMatch){
                console.log("Success");
                return done(null, user);
            } else {
                // console.log("Invalid password");
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

router.post('/login', passport.authenticate('local'), function(req, res) {
    // console.log(req);
    console.log(req.authInfo);
    res.send("Logged in");
    // res.redirect('/');
  });

router.get('/logout', function(req, res){
    req.logout();

    res.send("Logged out");
	// req.flash('success_msg', 'You are logged out');

	// res.redirect('/users/login');
});

module.exports = router;