var express = require('express');
var router = express.Router();
var cheese = require('cheese-name');
var passport = require('passport');
// var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done) {
    console.log("Serializing");
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    console.log("Deserializing");
    console.log(id);
    User.getUserById(id, function(err, user) {
        console.log(user);
        done(err, user);
    });
});

var User = require('../models/user');
var Channel = require('../models/channel');

router.get('/isloggedin', function(req, res){
    if(req.isAuthenticated()){
        res.send("Yes")
	} else {
		//req.flash('error_msg','You are not logged in');
		res.send("No");
	}
})

router.post('/:channelName/play', function(req, res){
    var channelName = req.params.channelName;
    if(req.isAuthenticated()){
        Channel.getChannelModerators(channelName, function(err, moderators){
            if(err){
                console.log(err);
            }
            if(!moderators){
                return res.send(400);
            } else {
                modNames = []
                moderators.forEach(function(mod) {
                    modNames.push(mod.username);
                }, this);
                if(modNames.includes(req.user.username)){
                    res.send("PLAY CHANNEL");
                } else {
                    res.send("NOT A MODERATOR");
                }
            }
            
        })
        // res.send("Yes")
	} else {
		//req.flash('error_msg','You are not logged in');
		res.send("Not logged in.");
	}
});

router.post('/:channelName/pause', function(req, res){
    var channelName = req.params.channelName;
    if(req.isAuthenticated()){
        Channel.getChannelModerators(channelName, function(err, moderators){
            if(err){
                console.log(err);
            }
            if(!moderators){
                return res.send(400);
            } else {
                modNames = []
                moderators.forEach(function(mod) {
                    modNames.push(mod.username);
                }, this);
                if(modNames.includes(req.user.username)){
                    res.send("PAUSE CHANNEL");
                } else {
                    res.send("NOT A MODERATOR");
                }
            }
            
        })
        // res.send("Yes")
	} else {
		//req.flash('error_msg','You are not logged in');
		res.send("Not logged in.");
	}
});

router.post('/:channelName/skip', function(req, res){
    var channelName = req.params.channelName;
    if(req.isAuthenticated()){
        Channel.getChannelModerators(channelName, function(err, moderators){
            if(err){
                console.log(err);
            }
            if(!moderators){
                return res.send(400);
            } else {
                modNames = []
                moderators.forEach(function(mod) {
                    modNames.push(mod.username);
                }, this);
                if(modNames.includes(req.user.username)){
                    res.send("SKIP CHANNEL");
                } else {
                    res.send("NOT A MODERATOR");
                }
            }
            
        })
        // res.send("Yes")
	} else {
		//req.flash('error_msg','You are not logged in');
		res.send("Not logged in.");
	}
});

// Create a new channel
router.post('/', function(req, res){
	var newChannelName = cheese();
    // Replaces whitespace with dashes
    newChannelName = newChannelName.replace(/\s/g , "-");
    console.log("newCheese: " + newChannelName);

    var newChannel = new Channel({
			channelName: newChannelName
		});

    Channel.createChannel(newChannel, function(err, channel){
        
        if(err){
            // console.log(err);
            res.status(500);
            res.send(err.errmsg);
        } else {
            console.log(channel);
            res.send({channelName: channel.channelName});
        }
    });	
});

// add moderator to channel
router.get('/:channelName/moderators', function(req, res){
	var channelName = req.params.channelName;
    Channel.getChannelModerators(channelName, function(err, moderators){
        if(err){
            console.log(err);
        }
        if(!moderators){
            res.status(400);
            res.send("No channel with that name");
        } else {
            console.log(moderators);
            modNames = []
            moderators.forEach(function(mod) {
                modNames.push(mod.username);
            }, this);
            res.send(modNames);
        }
    });

    // res.end();
});

// add moderator to channel
router.post('/:channelName/addModerator/:username', function(req, res){
	var channelName = req.params.channelName;
    var username = req.params.username;
    User.getUserByUsername(username, function(err, user){
        // var userId = user.id;
        // console.log(userId);
        Channel.addNewModerator(channelName, user, function(err, channel){
            if(err){
                console.log(err);
            }
            if(!channel){
                res.status(400);
                res.send("No channel with that name");
            } else {
                console.log(channel);
                res.send("Added user to channel");
            }
        });

    });

    // res.end();
});

module.exports = router;