'use strict';

var request = require('request');
var moment = require('moment');

module.exports = function retrieveEvents(intraToken, cb) {
  var lastThreeMonth = moment().subtract(3, 'month');
  var nextMonth = moment().add(1, 'month');
  var url = 'https://intra.epitech.eu/auth-' + intraToken + '/planning/load';
  request.get({
    uri: url,
    json: true,
    qs: {
      format: 'json',
      start: lastThreeMonth.format('YYYY-MM-DD'),
      end: nextMonth.format('YYYY-MM-DD'),
      onlymypromo: 'true',
      onlymymodule: 'true',
      onlymyevent: 'true'
    }
  }, function(err, res, body) {
    cb(err, body);
  });
};
