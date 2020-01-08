"use strict";

const log = require('fancy-log');
const chalk = require('chalk');

module.exports.debug = (message) => {
  log(message);
};

module.exports.error = (error) => {
  log.error(chalk.red(error.stack));
};

module.exports.phase = (phaseName) => {
  log(chalk.blueBright(`◼ ${phaseName}`));
};

module.exports.line = () => {
  log('-----------------------------------------------------');
};

module.exports.banner = (version) => {
  log(chalk.bgHex("0xF74B00").black(` -=[Spig v${version}]=- `));
};

module.exports.task = (name) => {
  log('⭐️ ' + chalk.yellow(name));
};
