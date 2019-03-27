"use strict";

const SpigConfig = require('../spig-config');
const Meta = require('../meta');
const Path = require('path');
const fs = require('fs');

module.exports = (file) => {
  const site = SpigConfig.site();

  // create meta data

  let meta = Meta.create(file);
  meta.isPage = false;

  let path = site.srcDir + site.dirSite + '/' + meta.dir;

  while (path !== '.') {
    const jsonFile = path + '/_.json';
    if (fs.existsSync(jsonFile)) {
      const config = JSON.parse(fs.readFileSync(jsonFile));
      meta = {...config, ...meta};
    }
    path = Path.dirname(path);
  }

  // update meta data for file
  Meta.update(file, meta);
};
