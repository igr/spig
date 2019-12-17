"use strict";

const fs = require('fs');
const Path = require('path');
const SpigConfig = require('./spig-config');

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


class SpigUtil {

  /**
   * Reads attributes on path.
   */
  readAttributesOnPath(path, fileBaseName) {
    const dev = SpigConfig.dev;
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
      const config = require(jsRequireModule)();

      attr = {...config, ...attr};
    }

    return attr
  }

}

module.exports = new SpigUtil();
