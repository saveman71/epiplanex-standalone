#!/bin/env node
'use strict';

/**
 * Insert events to mongoDB from JSON
 */
var mongoose = require('mongoose');
var async = require('async');

var config = require("../config");
mongoose.connect(config.mongoUrl);

var Event = require('../lib/models/event');
var parseIntraEvent = require('../lib/helpers/intra/index.js').parseIntraEvent;

if(!process.argv[2]) {
  console.error('Provide a source JSON please');
  process.exit(1);
}
var events = require(process.cwd() + '/' + process.argv[2]);

async.each(events, function create(item, cb) {
  var newEvent = parseIntraEvent(item);
  if(!newEvent) {
    return cb();
  }

  Event.update({
    intraId: newEvent.intraId
  }, newEvent, {
    upsert: true
  }, function(err) {
    console.log(arguments);
    cb(err);
  });
}, function(err) {
  if(err) {
    throw err;
  }
  console.log("Done");
  process.exit(0);
});
