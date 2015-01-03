'use strict';

var mongoose = require('mongoose');

var EventSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: true,
    default: 'Untitled'
  },


  intraLocationCode: {
    type: String,
    trim: true,
  },

  intraModuleTitle: {
    type: String,
    trim: true,
  },

  intraModuleCode: {
    type: String,
    trim: true,
  },

  intraId: {
    type: Number,
    required: true,
    unique: true,
    min: 0
  },

  intraTypeTitle: {
    type: String,
    trim: true,
  },

  intraTypeCode: {
    type: String,
    trim: true,
  },

  start: {
    type: Date,
    required: true
  },

  // Checked and assigned in pre-save hook
  end: {
    type: Date,
  },
});


EventSchema.pre('save', function(cb) {
  if(!this.end || this.end > this.start) {
    this.end = new Date(this.start + 3600 * 1000); // Default to start + 1 hour;
  }
  cb();
});

module.exports = mongoose.model('Event', EventSchema);
