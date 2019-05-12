"use strict";

const SpigConfig = require('./spig-config');
const Path = require('path');
const fs = require('fs');

module.exports = (file) => {
  const dev = SpigConfig.dev;

  let path = dev.srcDir + dev.dirSite + file.dir;

  let attr = {};
  while (path !== './') {
    const jsonFile = path + '_.json';
    if (fs.existsSync(jsonFile)) {
      const config = JSON.parse(fs.readFileSync(jsonFile));
      attr = {...config, ...attr};
    }

    const jsFile = path + '_.js';
    if (fs.existsSync(jsFile)) {
      const jsRelativePath = '../' + Path.relative(dev.root, Path.normalize(jsFile));
      const requireModule = jsRelativePath.substr(0, jsRelativePath.length - 3);
      const config = require(requireModule)();

      attr = {...config, ...attr};
    }

    path = Path.dirname(path) + '/';
  }

  // update attributes for file

  file.attr = {...file.attr, ...attr};

};
