var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');

var User = mongoose.model('User', db.userSchema);

module.exports = User;
