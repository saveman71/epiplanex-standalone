"use strict";

var mongoose = require('mongoose');
var async = require('async');
var icalendar = require('icalendar');

var config = require('../../../config/');
var updateEvents = require('../../helpers/update-events.js');
var getLocation = require('../../helpers/intra/get-location.js');
var Event = mongoose.model('Event');

var fromJSONToVEvent = function(json) {
  var event = new icalendar.VEvent(json.intraId);
  event.setSummary(json.title);
  if (json.location) {
    event.setLocation(json.location.address || json.location.title);
    event.setDescription('Room: ' + json.location.title);
  }
  var urlComponents = [json.intraYear, json.intraModuleCode, json.intraInstanceCode, 'acti-' + json.intraId];
  event.addProperty('URL', 'https://intra.epitech.eu/module/' + urlComponents.join('/'));
  event.setDate(json.start, json.end);
  return event;
};

module.exports.get = function(req, res, next) {
  var format = 'json';
  if(req.query.format && (req.query.format === 'ical' || req.query.format === 'json')) {
    format = req.query.format;
  }

  async.waterfall([
    function callUpdateEvents(cb) {
      updateEvents(config.intraToken, cb);
    },
    function getEvents(cb) {
      Event.find({}, cb);
    },
    function render(events, cb) {
      if(format === 'ical') {
        var ical = new icalendar.iCalendar();
        events.forEach(function(event) {
          event.location = getLocation(event.intraLocationCode);
          ical.addComponent(fromJSONToVEvent(event));
        });
        res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
        res.setHeader('Content-Disposition', 'attachment; filename=events.ics');
        res.send(ical.toString());
        return cb();
      }
      else {
        res.redirect('/');
      }
    }
  ], next);
};
