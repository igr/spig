"use strict";

const SpigConfig = require('../spig-config');
const serveStatic = require('serve-static');
const http = require('http');
const connect = require('connect');
const log = require('../log');

const serverInitFunction = (err) => {
  if (err) throw err;

  const dev = SpigConfig.dev;

  log.info(`Server started at http://${dev.server.hostname}:${dev.server.port}`);
};

module.exports = () => {
  log.task("serve");

  const dev = SpigConfig.dev;

  const app = connect();
  app.use(serveStatic(dev.outDir));

  const server = http
    .createServer(app)
    .listen(dev.server.port, dev.server.hostname, serverInitFunction);
};
