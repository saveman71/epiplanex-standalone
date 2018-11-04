"use strict";

var mongoose = require('mongoose');
var async = require('async');

var Event = mongoose.model('Event');
var getLocation = require('../helpers/intra/get-location.js');

module.exports.get = function(req, res, next) {
  async.waterfall([
    function getEvents(cb) {
      Event.find({}, cb);
    },
    function render(events, cb) {
      events = events.map(function(event) {
        event.location = getLocation(event.intraLocationCode);
        return event;
      });
      res.render('index', {events: events});
      cb();
    }
  ], next);
};
