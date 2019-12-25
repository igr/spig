"use strict";

const glob = require("glob");
const SpigUtil = require('../spig-util');
const dev = require('../spig-config').dev;

const sourceRoot = dev.srcDir + dev.dirStatic;
const sourceBase = dev.srcDir + dev.dirStatic + '/';
const files = sourceRoot + "/**/*";

module.exports = task;
module.exports.watch = {files: files, task: task};

function task() {
  SpigUtil.logTask("static");

  glob.sync(files)
    .filter(file => file.startsWith(sourceBase))
    .forEach(file => processFile(file));
}

function processFile(file) {
  const destination = file.substr(sourceBase.length);

  SpigUtil.copyFileToOutDir(destination, file);
}
