"use strict";

const _s = require("underscore.string");
const SpigUtil = require('./spig-util');
const Path = require('path');

module.exports = (file) => {
  let path = file.dir;

  let attr = SpigUtil.readAttributesOnPath(path, "__");

  while (path !== '/') {
    let config = SpigUtil.readAttributesOnPath(path, "_");

    attr = {...config, ...attr};

    path = Path.dirname(path);

    if (!_s.endsWith(path, '/')) {
      path += '/';
    }
  }

  // update attributes for file

  file.attr = {...file.attr, ...attr};

};
