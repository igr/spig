"use strict";

const dev = require('../spig-config').dev;
const serveStatic = require('serve-static');
const http = require('http');
const connect = require('connect');

const serverInitFunction = (err) => {
  if (err) throw err;
  //util.log(util.colors.blue('Server started at ' + scheme + '://' + address + ':' + port));
};

module.exports = () => {
  const app = connect();
  app.use(serveStatic(dev.outDir));

  let server = http
    .createServer(app)
    .listen(dev.local.port, dev.local.hostname, serverInitFunction);

};
