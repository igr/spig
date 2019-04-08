"use strict";

const Path = require('path');
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

  const layout = file.attr.layout;
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

  // try basename as layout name

  for (let ext of dev.templates.extensions) {
    layoutFile = findLayout(layoutsDir, file.dir, file.basename + ext);
    if (layoutFile) {
      return layoutFile;
    }
  }

  // try name as layout name

  for (let ext of dev.templates.extensions) {
    layoutFile = findLayout(layoutsDir, file.dir, file.name + ext);
    if (layoutFile) {
      return layoutFile;
    }
  }

  // try dirnames
  let dir = file.dir;
  while (true) {
    if (dir.endsWith('/')) {
      dir = dir.substr(0, dir.length - 1);
    }
    const ndx = dir.lastIndexOf('/');
    if (ndx === -1) {
      break;
    }

    const name = dir.substr(ndx + 1);
    dir = dir.substr(0, ndx + 1);

    for (let ext of dev.templates.extensions) {
      layoutFile = findLayout(layoutsDir, dir, name + ext);
      if (layoutFile) {
        return layoutFile;
      }
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

/**
 * Finds layout by checking for layout file on path and all upper paths.
 */
function findLayout(layoutsDir, path, layout) {
  if (layout.startsWith('spig:')) {
    return "spig-" + layout.substr(5);
  }

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
