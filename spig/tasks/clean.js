"use strict";

const del = require('del');
const dev = require('../spig-config').dev;
const log = require('../log');

module.exports = () => {
  log.task("clean");
  del([
    dev.outDir + '/**/*'
  ]);
};
