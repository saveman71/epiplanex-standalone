'use strict';


var async = require('async');
var rarity = require('rarity');

var Event = require('../models/event');
var toHash = require('./to-hash.js');
var intra = require('./intra/index.js');

module.exports = function(events, cb) {
  async.waterfall([
    function(cb) {
      events = events.filter(function(item) {
        return item.event_registered && item.event_registered !== '';
      });
      events = events.map(function(item) {
        return intra.parseEvent(item);
      });
      var ids = events.map(function(item) {
        return item.intraId;
      });
      Event.find({
        intraId: {
          $in: ids
        }
      }, rarity.carry([events], cb));
    },
    function(events, eventsDb, cb) {
      var hashedEvents = toHash(events, 'intraId');
      var hashedDbEvents = toHash(eventsDb, 'intraId');
      async.parallel([
        function(cb) {
          async.each(eventsDb, function create(item, cb) {
            item.update(hashedEvents[item.id], cb);
          }, cb);
        },
        function(cb) {
          events = events.filter(function(item) {
            return !hashedDbEvents[item.intraId];
          });
          if (events.length) {
            Event.collection.insert(events, cb);
          }
          else {
            cb();
          }
        }
      ], rarity.slice(1, cb));
    }
  ], cb);
};
