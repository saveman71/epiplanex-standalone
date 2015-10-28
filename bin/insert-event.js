#!/bin/env node
'use strict';

/**
 * Insert events to mongoDB from JSON
 */
var mongoose = require('mongoose');
var config = require("../config");
mongoose.connect(config.mongoUrl);
var insertEvents = require('../lib/helpers/insert-events.js');

if(!process.argv[2]) {
  console.error('Provide a source JSON please');
  process.exit(1);
}
var events = require(process.cwd() + '/' + process.argv[2]);

console.time('test');

insertEvents(events, function(err) {
  if (err) {
    console.log(err);
  }
  console.timeEnd('test');
  process.exit(0);
});
