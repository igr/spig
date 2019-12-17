"use strict";

const _s = require("underscore.string");
const SpigUtil = require('./spig-util');
const Path = require('path');

module.exports = (file) => {
  let path = file.dir;

  let attr = SpigUtil.readAttributesOnPath(file, path, "__");

  while (true) {
    let config = SpigUtil.readAttributesOnPath(file, path, "_");

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

  // update attributes for file

  file.attr = {...file.attr, ...attr};

};
