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

module.exports.info = (message) => {
  log(chalk.magentaBright(message));
};

module.exports.line = (msg) => {
  if (msg) {
    msg = `[${msg}]`
  } else {
    msg = '';
  }
  console.log(`---${msg}--------------------------------------------------`.substr(0, 50));
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

module.exports.pair = (message, file) => {
  log(message + ' ' + chalk.magenta(file));
};

module.exports.env = (value) => {
  log('Environment: ' + chalk.green(value));
};

module.exports.fileOut = (fileRef) => {
  let outname = fileRef.spig.def.destDir + fileRef.out;
  if (outname.startsWith('//')) {
    outname = outname.substr(1);
  }

  const outNameChalked = (fileRef.page) ? chalk.green(outname) : chalk.yellow(outname);
  if (fileRef.syntethic) {
    console.log(outNameChalked);
  } else {
    console.log(outNameChalked + " ⮜ " + chalk.blue(fileRef.root + fileRef.path));
  }
};

module.exports.notification = (message) => {
  log(chalk.cyan(message));
};

module.exports.buildTime = (elapsedMilliseconds) => {
  const {sec, ms} = millisToSeconds(elapsedMilliseconds);
  log(chalk.white(`🔥 Site built in ${sec}.${ms}s.`));
};

module.exports.totalTime = (elapsedMilliseconds) => {
  const {sec, ms} = millisToSeconds(elapsedMilliseconds);
  log(chalk.white(`✅ All done. Total time ${sec}.${ms}s.`));
};

function millisToSeconds(elapsedMilliseconds) {
  const sec = Math.floor(elapsedMilliseconds / 1000);
  let ms = Math.floor((elapsedMilliseconds % 1000) / 10);
  if (ms < 10) {
    ms = '0' + ms;
  }
  return {sec, ms};
}
