"use strict";

// Load env with dotenv from .env file
var dotenv = require('dotenv');
dotenv.load();

// node_env can either be "development", "production" or "test"
var nodeEnv = process.env.NODE_ENV || "development";

var port = process.env.PORT || 3000;

// URL for mongo access
var mongoUrl = process.env.MONGOLAB_URI || process.env.MONGO_URL || "mongodb://localhost/epiplanex-" + nodeEnv;

// Intra endpoint
var intraUrl = process.env.INTRA_URL || 'https://intra.epitech.eu';

// Intra token
if(!process.env.INTRA_TOKEN) {
  console.error('INTRA_TOKEN must be set');
  process.exit(1);
}
var intraToken = process.env.INTRA_TOKEN;

// Secret
var secret = process.env.SECRET || 'superSecret42';

module.exports = {
  port: port,
  // URL for mongo access
  mongoUrl: mongoUrl,
  // Intra endpoint
  intraUrl: intraUrl,
  // Intra token
  intraToken: intraToken,
  // Secret
  secret: secret
};
