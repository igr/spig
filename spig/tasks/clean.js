"use strict";

const del = require('del');
const SpigConfig = require('../spig-config');
const log = require('../log');

module.exports = () => {
  log.task("clean");

  const dev = SpigConfig.dev;

  del([
    dev.outDir + '/**/*'
  ]);
};
