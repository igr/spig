"use strict";

const log = require('fancy-log');
const chalk = require('chalk');

module.exports.debug = (message) => {
  log(chalk.dim(message));
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
  console.log();
  console.log(chalk.bgHex("0xF74B00").black(` -=[Spig v${version}]=- `));
  console.log();
};

module.exports.task = (name) => {
  log('⭐️ ' + chalk.yellowBright(name));
};

module.exports.operation = (name) => {
  log(chalk.dim('● ' + name));
};

module.exports.fileOut = (fileRef) => {
  let outname = fileRef.spig.def.destDir + fileRef.out;
  if (outname.startsWith('//')) {
    outname = outname.substr(1);
  }
  if (fileRef.syntethic) {
    console.log(chalk.green(outname));
  } else {
    console.log(chalk.green(outname) + " ⮜ " + chalk.blue(fileRef.root + fileRef.path));
  }
};

module.exports.info = (message) => {
  log(chalk.magentaBright(message));
};

module.exports.notification = (message) => {
  log(chalk.cyan(message));
};

module.exports.build = (elapsedMilliseconds) => {
  const sec = Math.floor(elapsedMilliseconds / 1000);
  let ms = Math.floor((elapsedMilliseconds % 1000) / 10);
  if (ms < 10) {
    ms = '0' + ms;
  }
  log(chalk.white(`🔥 Site built in ${sec}.${ms} s.`));
};

