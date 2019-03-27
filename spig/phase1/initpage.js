"use strict";

const SpigConfig = require('../spig-config');
const SpigFiles = require('../spig-files');
const Meta     = require('../meta');
const Path     = require('path');
const fs       = require('fs');

module.exports = (file) => {
  const site = SpigConfig.site();

  // create meta data
  file.page = true;

  let path = site.srcDir + site.dirSite + '/' + file.dir;

  let attr = {};
  while(path !== '.') {
    const jsonFile = path + '/_.json';
    if (fs.existsSync(jsonFile)) {
      const config = JSON.parse(fs.readFileSync(jsonFile));
      attr = {...config, ...attr};
    }
    path = Path.dirname(path);
  }

  // update meta data for file
  Meta.updateAttr(file, attr);

  // register page
  SpigFiles.registerSitePage(file);
};
