"use strict";

const SpigConfig = require('../spig-config');
const SpigFiles = require('../spig-files');
const Path     = require('path');
const fs       = require('fs');

module.exports = (file, options = {page: true}) => {
  const site = SpigConfig.siteConfig;

  SpigFiles.updateMeta(file, options);

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
  SpigFiles.updateAttr(file, attr);

};
