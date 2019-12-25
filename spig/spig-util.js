"use strict";

const fs = require('fs');
const Path = require('path');
const log = require('fancy-log');
const chalk = require('chalk');
const dev = require('./spig-config').dev;

const attrFilesCache = {};

function readCached(file) {
  if (attrFilesCache[file]) {
    return attrFilesCache[file];
  }

  attrFilesCache[file] = {};

  if (fs.existsSync(file)) {
    attrFilesCache[file] = JSON.parse(fs.readFileSync(file));
  }
  return attrFilesCache[file];
}


/**
 * Reads attributes on path.
 */
exports.readAttributesOnPath = (file, path, fileBaseName) => {
  let root = dev.srcDir + dev.dirSite;

  let attr = {};

  // JSON

  const jsonFile = root + path + fileBaseName + '.json';
  let config = readCached(jsonFile);

  attr = {...config, ...attr};

  // JS

  const jsFile = root + path + fileBaseName + '.js';

  if (fs.existsSync(jsFile)) {
    const jsRelativePath = '../' + Path.relative(dev.root, Path.normalize(jsFile));
    const jsRequireModule = jsRelativePath.substr(0, jsRelativePath.length - 3);
    const config = require(jsRequireModule)(file);

    attr = {...config, ...attr};
  }

  return attr
};

function ensureFilesDirectoryExists(filePath) {
  const dirname = Path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureFilesDirectoryExists(dirname);
  fs.mkdirSync(dirname);
}


/**
 * Copies a file to output directory.
 */
exports.copyFileToOutDir = (destinationDirectory, sourceFile) => {
  const destFile = dev.outDir + '/' + destinationDirectory;
  ensureFilesDirectoryExists(destFile);
  fs.copyFileSync(sourceFile, destFile);
};

/**
 * Writes content to outs.
 */
exports.writeToOut = (destinationDirectory, filename, content) => {
  const destFile = dev.outDir + destinationDirectory + '/' + filename;
  ensureFilesDirectoryExists(destFile);
  fs.writeFileSync(destFile, content);
};

/**
 * Logs a task.
 */
exports.logTask = (name) => {
  log(chalk.yellow(name));
};
