"use strict";

const _s = require("underscore.string");
const SpigUtil = require('./spig-util');
const Path = require('path');

module.exports = (file) => {
  let path = file.dir;

  let attr = SpigUtil.readAttributesOnPath(path, "__");

  // this weird flag is here just because Path.dirname returns the same value for
  // the root path ("/") - and the root must be processed once.
  let breakIt = false;

  while (true) {
    let config = SpigUtil.readAttributesOnPath(path, "_");

    attr = {...config, ...attr};

    if (breakIt) {
      break
    }

    path = Path.dirname(path);
    if (path === '/') {
      breakIt = true
    }

    if (!_s.endsWith(path, '/')) {
      path += '/';
    }
  }

  // update attributes for file

  file.attr = {...file.attr, ...attr};

};
