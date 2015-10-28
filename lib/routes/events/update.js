'use strict';

var async = require('async');

var config = require('../../../config/');
var updateEvents = require('../../helpers/update-events.js');

module.exports.get = function(req, res, next) {
  async.waterfall([
    function callUpdateEvents(cb) {
      updateEvents(config.intraToken, cb);
    },
    function render() {
      res.redirect('/events');
    }
  ], next);
};
