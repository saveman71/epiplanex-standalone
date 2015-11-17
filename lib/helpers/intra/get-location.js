'use strict';

var locations = require('./locations.json');

var addresses = [
  {
    regex: /FR\/LYN/,
    value: 'Default, 156 Rue Paul Bert, 69003 Lyon, France'
  },
  {
    regex: /FR\/LYN\/bayard*/,
    value: 'Bayard, 156 Rue Paul Bert, 69003 Lyon, France'
  },
  {
    regex: /FR\/LYN\/Panoramic*/,
    value: 'Panoramic, 85 Boulevard Marius Vivier Merle, 69003 Lyon, France'
  },
  {
    regex: /FR\/LYN\/Iseg*/,
    value: 'Iseg, 86 Boulevard Marius Vivier Merle, 69003 Lyon, France'
  },
  {
    regex: /FR\/LYN\/Gemellyon*/,
    value: 'Gemellyon, 59 Boulevard Marius Vivier Merle, 69003 Lyon, France'
  }
];

module.exports = function getLocation(locationName) {
  var location = locations[locationName];
  addresses.forEach(function(address) {
    if (locationName.match(address.regex)) {
      location.address = address.value;
    }
  });
  return location;
};
