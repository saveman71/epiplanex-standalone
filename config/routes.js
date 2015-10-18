"use strict";

var autoload = require('auto-load');

var lib = autoload(__dirname + '/../lib');
var routes = lib.routes;
var middlewares = lib.middlewares;

module.exports = function(app) {
  app.get('/', middlewares.isAuth, routes.index.get);

  app.get('/login', routes.login.get);
  app.post('/login', routes.login.post);
  app.get('/logout', middlewares.isAuth, routes.logout.get);

  app.get('/events', middlewares.isAuth, routes.events.get);
};
