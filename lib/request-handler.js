var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');

// var db = require('../app/config');
// var User = require('../app/models/user');
// var Link = require('../app/models/link');
var MongoLink = require('../MongoApp/models/link');
var MongoUser = require('../MongoApp/models/user');
// var Users = require('../app/collections/users');
// var Links = require('../app/collections/links');

exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function() {
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  MongoLink.find(function(err, docs){
    res.send(200, docs);
  });
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.send(404);
  }
  MongoLink.find({ url: uri }, function(err, urls) {
    if (urls.length > 0) {
      res.send(200, urls[0]);
    } else {
      util.getUrlTitle(uri, function(err, title) {
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.send(404);
        }
        MongoLink.create({
          url: uri,
          title: title,
          base_url: req.headers.origin
        }, function(err, linkylink) {
          if(err){
            console.error(err);
          }
          res.send(200, linkylink);
        });
      });
    }
  });
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  MongoUser.find({ username: username }, function(err, users){
    var user = users[0];
    if (!user) {
      res.redirect('/login');
    } else {
      user.comparePassword(password, function(match) {
        if (match) {
          util.createSession(req, res, user);
        } else {
          res.redirect('/login');
        }
      })
    }
  });
};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  MongoUser.find({ username: username }, function(err, users) {
      var user = users[0];
      if (!user) {
        MongoUser.create({
          username: username,
          password: password
        }, function(err, newUser) {
          if (err) { 
            console.error(err); 
          }
          util.createSession(req, res, newUser);
        });
      } else {
        console.log('Account already exists');
        res.redirect('/signup');
      }
    });
};

exports.navToLink = function(req, res) {
  MongoLink.find({code: req.params[0]}, function(err, links){
    var link = links[0];
    if (!link) {
      res.redirect('/');
    } else {
      MongoLink.update({code: req.params[0]}, {visits: link.visits + 1}, {}, function(){
        return res.redirect(link.get('url'));
      });
    }
  });
};





