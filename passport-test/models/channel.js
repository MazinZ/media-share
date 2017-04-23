var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var User = require('../models/user');

// User Schema
var ChannelSchema = mongoose.Schema({
    channelName: {
        type: String,
        unique: true
    },
	moderators: {
		type: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
	},
});

var Channel = module.exports = mongoose.model('Channel', ChannelSchema);

module.exports.createChannel = function(newChannel, callback){
	newChannel.save(callback);
}

module.exports.getChannelByChannelname = function(channelName, callback){
	var query = {channelName: channelName};
	Channel.findOne(query, callback);
}

module.exports.getChannelModerators = function(channelName, callback){
	var query = {channelName: channelName};

	Channel.findOne(query, function(err, channel){
        if(err) console.log(err);
        if(!channel){
            callback(err, null);
        }
        else {
            channel.populate("moderators", function(err, channel){
                if(err) console.log(err);
                else {
                    console.log("2");
                    console.log(channel);
                    var moderators = channel.moderators;
                    callback(err, moderators);
                }
            });
        }
    });
}


module.exports.getChannelById = function(id, callback){
	Channel.findById(id, callback);
}

module.exports.addNewModerator = function(channelName, user, callback){
	var query = {channelName: channelName};
	console.log("Adding mod to channel: " + channelName);
	var newChannel = {
        moderators: user
    };
    Channel.findOneAndUpdate(query, {$push: newChannel} , callback);
}