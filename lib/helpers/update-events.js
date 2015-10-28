'use strict';

var async = require('async');

var intra = require('./intra/');
var insertEvents = require('./insert-events.js');

module.exports = function updateEvents(token, cb) {
  async.waterfall([
    function callRetrieveEvents(cb) {
      intra.retrieveEvents(token, cb);
    },
    function callInsertEvents(events, cb) {
      insertEvents(events, cb);
    }
  ], cb);
};
