var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var q = require('q');

// User Schema
var UserSchema = mongoose.Schema({
	username: {
		type: String,
		index: true,
		unique: true
	},
	password: {
		type: String
	},
	email: {
		type: String,
		index: true,
		unique: true
	},
	name: {
		type: String
	}
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash;
	        newUser.save(callback);
	    });
	});
}

module.exports.getUserByUsername = function(username, callback){
	var query = {username: username};
	User.findOne(query, callback);
}

module.exports.updateUser = function(username, updateParams, callback){
	var query = {username: username};
	console.log("Updating user: " + username);
	console.log(updateParams);
	var newUser = {};
	if(updateParams.name) newUser.name = updateParams.name;
	if(updateParams.email) newUser.email = updateParams.email;
	if(updateParams.password){
		genPasswordHash(updateParams.password)
		.then(function(hash){
			newUser.password = hash;
			console.log("updating password");
			console.log(newUser);
			User.findOneAndUpdate(query, newUser, callback);
		});
	} else {
		console.log("NOT updating password");
		console.log(newUser);
		User.findOneAndUpdate(query, newUser, callback);
	}	
}

module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}

function genPasswordHash(password){
	var deferred = q.defer();
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(password, salt, function(err, hash) {
	        deferred.resolve(hash);
	    });
	});
	return deferred.promise;
}