#!/bin/env node
'use strict';

/**
 * Transform an array of hash to some hash, using specified key as identifier.
 * toHash([{id:1, a: "lol"}], "id") == {1: {id:1, a: "lol"}}
 *
 * Linearize key can remove the hash structure entirely, using the specified key as a value.
 * toHash([{id:1, a: "lol"}], "id", "a") == {1: "lol"}
 */
var toHash = function(arr, prop, linearizeKey) {
    var hash = {};

    arr.forEach(function(e) {
        var key = e[prop].toString();
        if(linearizeKey) {
            e = e[linearizeKey];
        }

        hash[key] = e;
    });

    return hash;
};


/**
 * Insert events to mongoDB from JSON
 */
var mongoose = require('mongoose');
var async = require('async');
var rarity = require('rarity');

var config = require("../config");
mongoose.connect(config.mongoUrl);

var Event = require('../lib/models/event');
var parseIntraEvent = require('../lib/helpers/intra/index.js').parseIntraEvent;

if(!process.argv[2]) {
  console.error('Provide a source JSON please');
  process.exit(1);
}
var events = require(process.cwd() + '/' + process.argv[2]);

console.time('test');

async.waterfall([
  function(cb) {
    events = events.map(function(item) {
      return parseIntraEvent(item);
    });
    events = events.filter(function(item) {
      return item;
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
    ], cb);
  }
], function(err) {
  if (err) {
    console.log(err);
  }
  console.timeEnd('test');
  process.exit(0);
});
