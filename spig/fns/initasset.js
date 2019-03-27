"use strict";

const SpigConfig = require('../spig-config');
const Meta = require('../meta');
const Path = require('path');
const fs = require('fs');

module.exports = (file) => {
  if (file.ok) {
    return;
  }

  const site = SpigConfig.site();

  // create meta data

  file.isPage = false;

  let path = site.srcDir + site.dirSite + '/' + file.dir;
  let attr = {};

  while (path !== '.') {
    const jsonFile = path + '/_.json';
    if (fs.existsSync(jsonFile)) {
      const config = JSON.parse(fs.readFileSync(jsonFile));
      attr = {...config, ...attr};
    }
    path = Path.dirname(path);
  }

  // update meta data for file
  Meta.updateAttr(file, attr);
};
