"use strict";

const _s = require("underscore.string");
const Path = require('path');
const fs = require('fs');
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


/**
 * Reads attributes on path.
 */
function readAttributesOnPath(file, path, fileBaseName) {
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
    const config = require(jsRequireModule)(file);

    attr = {...config, ...attr};
  }

  return attr
}


module.exports = (fileRef) => {
  let path = fileRef.dir;

  let attr = readAttributesOnPath(fileRef, path, "__");

  while (true) {
    let config = readAttributesOnPath(fileRef, path, "_");

    attr = {...config, ...attr};

    const oldPath = path;

    path = Path.dirname(path);

    if (oldPath === '/' && path === '/') {
      // this is the only way how we can be sure that
      // root has been processed once
      break
    }

    if (!_s.endsWith(path, '/')) {
      path += '/';
    }
  }

  // update attributes for file reference

  fileRef.attr = {...fileRef.attr, ...attr};

};
