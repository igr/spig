"use strict";

const del = require('del');
const dev = require('../spig-config').dev;

module.exports = () => {
  del([
    dev.outDir + '/**/*'
  ]);
};
