import fs from 'fs';
import Path from 'path';
import { spigConfig } from './ctx';
import { FileRef } from './file-reference';

/**
 * Finds layout by checking for layout file on path and all upper paths.
 */
function findLayout(layoutsDir: string, path: string, layout: string): string | undefined {
  if (layout.startsWith('spig:')) {
    return `spig-${layout.substr(5)}`;
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
      path += '/';
    }
  }
  return undefined;
}

/**
 * Resolves layout file from the file's attributes and meta-data.
 * The order is the following:
 * + use attribute `layout`,
 * + use file's basename,
 * + returns default template file name
 */
export function resolveLayout(fileRef: FileRef): string {
  const dev = spigConfig.dev;
  const templateCfg = spigConfig.ops.template;

  const layoutsDir = Path.normalize(dev.root + dev.srcDir + dev.dir.layouts);

  const layout = fileRef.attr('layout');
  let layoutFile;

  if (layout) {
    layoutFile = findLayout(layoutsDir, fileRef.dir, layout);
    if (layoutFile) {
      return layoutFile;
    }

    for (const ext of templateCfg.extensions) {
      layoutFile = findLayout(layoutsDir, fileRef.dir, layout + ext);
      if (layoutFile) {
        return layoutFile;
      }
    }
  }

  // try basename as layout name

  for (const ext of templateCfg.extensions) {
    layoutFile = findLayout(layoutsDir, fileRef.dir, fileRef.basename + ext);
    if (layoutFile) {
      return layoutFile;
    }
  }

  // try name as layout name

  for (const ext of templateCfg.extensions) {
    layoutFile = findLayout(layoutsDir, fileRef.dir, fileRef.name + ext);
    if (layoutFile) {
      return layoutFile;
    }
  }

  // try dirnames
  let dir = fileRef.dir;
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

    for (const ext of templateCfg.extensions) {
      layoutFile = findLayout(layoutsDir, dir, name + ext);
      if (layoutFile) {
        return layoutFile;
      }
    }
  }

  // default

  for (const ext of templateCfg.extensions) {
    layoutFile = findLayout(layoutsDir, fileRef.dir, templateCfg.default + ext);
    if (layoutFile) {
      return layoutFile;
    }
  }

  // nothing found

  return templateCfg.default;
}
