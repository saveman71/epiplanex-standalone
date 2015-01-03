"use strict";

var app = require('../../app.js');

module.exports.get = function(req, res, next) {
  res.render('login');
  next();
};

module.exports.post = function(req, res, next) {
  if(!req.param('token')) {
    return res.render('login', {
      error: 'Please specify a token',
    });
  }

  if(req.param('token') !== app.get('intraToken')) {
    return res.render('login', {
      error: 'The token is invalid',
      token: req.param('token')
    });
  }

  if(!req.session) {
    req.session = {};
  }
  var user = {
    token: app.get('intraToken')
  };
  req.session.user = user;
  if(req.session.returnTo) {
    var returnTo = req.session.returnTo;
    req.session.returnTo = null;
    return res.redirect(returnTo);
  }
  res.redirect('/');
  next();
};
