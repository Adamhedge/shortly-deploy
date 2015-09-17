var mongoose = require('mongoose');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');

//TODO: reroute mongoose to azure or localhost depending on...that thing.
//CHECK: do we need to make the test DB and do we need to call it something not test?
var mongooseHost = 'mongodb://localhost/test;'
mongoose.connect(mongooseHost);

//Connection handling
//TODO?: Do we need a user login for the database?
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function(callback){
  console.log("Connected to mongo at: " + mongooseHost);
});

//schema definitions

db.urlSchema = mongoose.Schema({
  url: String,
  base_url: String,
  code: String,
  title: String,
  visits: Number
});

db.userSchema = mongoose.Schema({
  username: String,
  password: String
});

db.urlSchema.pre('init', function(next, linkInfo){
  var shasum = crypto.createHash('sha1');
  shasum.update(linkInfo.url);
  linkInfo.code = shasum.digest('hex').slice(0, 5);
  linkInfo.visits = 0;
  next();
});

db.userSchema.pre('init', function(next, userInfo){
  var cipher = Promise.promisify(bcrypt.hash);
  return cipher(userInfo.password, null, null).bind(this)
    .then(function(hash) {
      userInfo.password = hash;
      next();
    });
});

db.userSchema.methods.comparePassword = function(attempedPassword, callback){
    bcrypt.compare(attemptedPassword, this.password, function(err, isMatch) {
      callback(isMatch);
    });  
};

module.exports = db;