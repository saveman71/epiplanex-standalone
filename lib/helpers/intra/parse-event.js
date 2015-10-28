'use strict';

var moment = require('moment-timezone');

var getOfficialId = function(intraEvent) {
  var matches = intraEvent.codeacti && intraEvent.codeacti.match(/acti-([0-9]+)/);
  if(!matches || !matches[1]) {
    return null;
  }
  var id = parseInt(matches[1]);
  if(!id) {
    return null;
  }
  return id;
};

var parseOfficalEvent = function(intraEvent) {
  var id = getOfficialId(intraEvent);

  // We need the id for identification purpose, we'll skip an event with an invalid id.
  if(!id) {
    return null;
  }

  var newEvent = {
    title: intraEvent.acti_title,
    intraLocationCode: intraEvent.room && intraEvent.room.code || intraEvent.instance_location || '',
    intraModuleTitle: intraEvent.titlemodule,
    intraModuleCode: intraEvent.codemodule,
    intraTypeTitle: intraEvent.type_title,
    intraTypeCode: intraEvent.type_code,
    intraInstanceCode: intraEvent.codeinstance,
    intraYear: intraEvent.scolaryear,
    intraId: id,
  };

  // This is an appointement, we can get the precise date
  if(intraEvent.rdv_group_registered || intraEvent.rdv_indiv_registered) {
    var dates = intraEvent.rdv_group_registered || intraEvent.rdv_indiv_registered;
    dates = dates.split('|');
    if(dates.length === 2) {
      newEvent.start = moment.tz(dates[0], 'Europe/Paris').toDate();
      newEvent.end = moment.tz(dates[1], 'Europe/Paris').toDate();
    }
  }

  // Did we succeed in finding a better date ? If not, get the default ones (start and end)
  if(!newEvent.start) {
    newEvent.start = moment.tz(intraEvent.start, 'Europe/Paris').toDate();
    newEvent.end = moment.tz(intraEvent.end, 'Europe/Paris').toDate();
  }

  return newEvent;
};


var parsePersoEvent = function(intraEvent) {
  // Generate an id for perso events, and make sure it won't overlap officials events
  var id = intraEvent.id * intraEvent.id_calendar;

  // We need the id for identification purpose, we'll skip an event with an invalid id.
  if(!id) {
    return null;
  }

  var newEvent = {
    title: intraEvent.title,
    intraId: intraEvent.id
  };

  newEvent.start = moment.tz(intraEvent.start, 'Europe/Paris').toDate();
  newEvent.end = moment.tz(intraEvent.end, 'Europe/Paris').toDate();
};


module.exports = function parseIntraEvent(intraEvent) {
  // Custom calendars, we need to handle this differently
  if(intraEvent.calendar_type === 'perso') {
    return parsePersoEvent(intraEvent);
  }
  return parseOfficalEvent(intraEvent);
};
