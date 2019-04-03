"use strict";

const Path = require('path');
const SpigFiles = require('./spig-files');
const fs = require('fs');
const SpigConfig = require('./spig-config');

/**
 * Resolves layout file from the file's attributes and meta-data.
 * The order is the following:
 * + use attribute `layout`,
 * + use file's basename,
 * + returns default template
 */
function resolveLayout(file) {
  const site = SpigConfig.siteConfig;
  const dev = SpigConfig.devConfig;
  const layoutsDir = Path.normalize(site.root + site.srcDir + site.dirLayouts);

  const layout = SpigFiles.attr(file, 'layout');
  let layoutFile;

  if (layout) {
    layoutFile = findLayout(layoutsDir, file.dir, layout);
    if (layoutFile) {
      return layoutFile;
    }

    for (let ext of dev.templateExtensions) {
      layoutFile = findLayout(layoutsDir, file.dir, layout + ext);
      if (layoutFile) {
        return layoutFile;
      }
    }
  }

  for (let ext of dev.templateExtensions) {
    layoutFile = findLayout(layoutsDir, file.dir, file.basename + ext);
    if (layoutFile) {
      return layoutFile;
    }
  }

  return dev.templateDefault;
}

function findLayout(layoutsDir, path, layout) {
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
  return undefined;
}


module.exports = resolveLayout;
