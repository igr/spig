"use strict";

const Path = require('path');
const Meta = require('./meta');
const fs = require('fs');
const SpigConfig = require('./spig-config');

function extractLayout(file) {
  const layout = Meta.attr(file, 'layout');

  const site = SpigConfig.site();
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
