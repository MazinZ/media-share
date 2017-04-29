var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');

// // Register
// router.get('/register', function(req, res){
//     // Render register screen
//     res.end();
// });

// // Login
// router.get('/login', function(req, res){
//     // Render login screen
//     res.end();
// });

// Needs to be above /:username
router.get('/me', ensureAuthenticated, function(req, res){
    var user = req.user;
    var response_obj = {
        username: user.username,
        name: user.name,
        email: user.email
    }
    res.json(response_obj);
});

router.get('/logout', function(req, res){
    req.logout();
    res.send("Logged out");
});

router.get('/isloggedin', function(req, res){
    if(req.isAuthenticated()){
        res.send("Yes")
	} else {
		//req.flash('error_msg','You are not logged in');
		res.send("No");
	}
})

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
        console.log("errors");
        res.status(400)
        res.send({errors: errors});
	} else {
		var newUser = new User({
			name: name,
			email:email,
			username: username,
			password: password
		});

		User.createUser(newUser, function(err, user){
			if(err){
                if(err.code == 11000){
                    res.status(400)
                    res.send("Username or email already exists");
                } else {
                    res.sendStatus(500);
                    res.send("Error occured");
                }
            }
			else if(!user){
                res.status(500);
                res.send("Could not create user");
            } else {
                 res.send("Succes created user: " + newUser.username);
            }
		});
	}
});

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
    // console.log(id);
    User.getUserById(id, function(err, user) {
        // console.log(user);
        done(err, user);
    });
});

router.post('/login', function(req, res, next) {
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

router.get('/:username', function(req, res){
    User.getUserByUsername(req.params.username, function(err, user){
        if(err) throw err;
        if(!user){
            res.status(404);
            res.send('Unknown User');
        } else {
            response = {
                name : user.name,
                username : user.username
            }
            res.send(response);
        }
    });
});

router.put('/:username', ensureAuthenticated, function(req, res){
    User.updateUser(req.user.username, req.body, function(err, user){
		if(err) throw err;
		if(!user){
            res.status(400);
			res.send('Unknown User');
		} else {
			res.sendStatus(200);
		}
	});
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
        res.status(401);
		res.send('Not logged in');
	}
}

module.exports = router;