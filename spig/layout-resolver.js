"use strict";

const Path = require('path');
const fs = require('fs');
const SpigFiles = require('./spig-files');
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

    for (let ext of dev.templates.extensions) {
      layoutFile = findLayout(layoutsDir, file.dir, layout + ext);
      if (layoutFile) {
        return layoutFile;
      }
    }
  }

  for (let ext of dev.templates.extensions) {
    layoutFile = findLayout(layoutsDir, file.dir, file.basename + ext);
    if (layoutFile) {
      return layoutFile;
    }
  }

  // default

  for (let ext of dev.templates.extensions) {
    layoutFile = findLayout(layoutsDir, file.dir, dev.templates.default + ext);
    if (layoutFile) {
      return layoutFile;
    }
  }

  // nothing found

  return dev.templates.default;
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

    if (path !== '/') {
      path = path + '/';
    }
  }
  return undefined;
}


module.exports = resolveLayout;
