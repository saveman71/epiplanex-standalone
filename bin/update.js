#!/bin/env node
'use strict';

var config = require('../config');
var mongoose = require('mongoose');
mongoose.connect(config.mongoUrl);

var updateEvents = require('../lib/helpers/update-events.js');

updateEvents(config.intraToken, function(err) {
  if (err) {
    throw err;
  }
  console.log('Done');
  process.exit(0);
});
