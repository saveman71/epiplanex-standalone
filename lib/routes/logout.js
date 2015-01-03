"use strict";

module.exports.get = function(req, res, next) {
  req.session.user = null;
  res.redirect('/');
  next();
};
