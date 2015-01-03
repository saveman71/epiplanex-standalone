"use strict";

var mongoose = require('mongoose');
var async = require('async');

var Event = mongoose.model('Event');


module.exports.get = function(req, res, next) {
  async.waterfall([
    function getEvents(cb) {
      Event.find({}, cb);
    },
    function render(events, cb) {
      console.log(events);
      res.render('index', {events: events});
      cb();
    }
  ], next);
};
