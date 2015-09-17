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

db.urlSchema.pre('save', function(next){
  var shasum = crypto.createHash('sha1');
  shasum.update(this.url);
  this.code = shasum.digest('hex').slice(0, 5);
  this.visits = 0;
  next();
});

db.userSchema.pre('save', function(next){
  var cipher = Promise.promisify(bcrypt.hash);
  return cipher(this.password, null, null).bind(this)
    .then(function(hash) {
      this.password = hash;
      next();
    });
});

db.userSchema.methods.comparePassword = function(attemptedPassword, callback){
    bcrypt.compare(attemptedPassword, this.password, function(err, isMatch) {
      callback(isMatch);
    });  
};

module.exports = db;