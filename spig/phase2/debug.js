"use strict";

const log = require('fancy-log');
const chalk = require('chalk');

/**
 * Debugs files meta-data to the output.
 */
module.exports = (file) => {
  log(chalk.gray('path>') + JSON.stringify(file.path));
  log(chalk.gray('out >') + JSON.stringify(file.out));
  log(chalk.gray('attr>') + JSON.stringify(file.attr));
};
