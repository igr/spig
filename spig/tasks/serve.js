"use strict";

const SpigConfig = require('../spig-config');
const serveStatic = require('serve-static');
const http = require('http');
const connect = require('connect');
const log = require('../log');

const serverInitFunction = (err) => {
  if (err) throw err;
  //todo add port etc
  log.info("Server started at")
  //util.log(util.colors.blue('Server started at ' + scheme + '://' + address + ':' + port));
};

module.exports = () => {
  log.task("serve");

  const dev = SpigConfig.dev;

  const app = connect();
  app.use(serveStatic(dev.outDir));

  const server = http
    .createServer(app)
    .listen(dev.local.port, dev.local.hostname, serverInitFunction);
};
