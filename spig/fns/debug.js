"use strict";

const log = require('fancy-log');
const chalk = require('chalk');

/**
 * Debugs files meta-data to the output
 */
module.exports = (file) => {
  log(chalk.gray('meta>') + JSON.stringify(file.meta));
  log(chalk.gray('attr>') + JSON.stringify(file.attr));
};
