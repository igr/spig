"use strict";

const Path = require('path');
const SpigFiles = require('./spig-files');
const fs = require('fs');
const SpigConfig = require('./spig-config');

function extractLayout(file) {
  const layout = SpigFiles.attr(file, 'layout');

  const site = SpigConfig.siteConfig;
  const layoutsDir = Path.normalize(site.root + site.srcDir + site.dirLayouts);

  let path = file.dir;

  while (true) {
    let layoutFile = path + layout;
    if (fs.existsSync(layoutsDir + layoutFile)) {
      if (layoutFile.startsWith('/')) {
        layoutFile = layoutFile.substr(1);
      }
      return layoutFile;
    }
    if (path === '/') {
      break;
    }
    path = Path.dirname(path);
  }

  return 'base.njk';
}


module.exports = extractLayout;
