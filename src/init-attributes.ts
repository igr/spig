import fs from 'fs';
import Path from 'path';
import _s from 'underscore.string';
import * as SpigConfig from './spig-config';
import { loadJs, loadJson } from './load';

type FileRef = import('./file-reference').FileRef;

/**
 * Reads attributes on path.
 */
function readAttributesOnPath(file: FileRef, path: string, fileBaseName: string): object {
  const dev = SpigConfig.dev;

  const root = dev.srcDir + dev.dir.site;

  let attr = {};

  // JSON

  const jsonFile = root + path + fileBaseName + '.json';
  const config = loadJson(jsonFile);

  attr = { ...config, ...attr };

  // JS

  const jsFile = root + path + fileBaseName + '.js';

  if (fs.existsSync(jsFile)) {
    const jsRelativePath = Path.relative(dev.root, Path.normalize(jsFile));
    const jsRequireModule = jsRelativePath.substr(0, jsRelativePath.length - 3);
    const jsModuleFn = loadJs(jsRequireModule);
    const jsConfig = jsModuleFn(file);

    attr = { ...jsConfig, ...attr };
  }

  return attr;
}

export function initAttributes(fileRef: FileRef): void {
  let path = fileRef.dir;

  let attr = readAttributesOnPath(fileRef, path, '__');

  while (true) {
    const config = readAttributesOnPath(fileRef, path, '_');

    attr = { ...config, ...attr };

    const oldPath = path;

    path = Path.dirname(path);

    if (oldPath === '/' && path === '/') {
      // this is the only way how we can be sure that
      // root has been processed once
      break;
    }

    if (!_s.endsWith(path, '/')) {
      path += '/';
    }
  }

  // update attributes for file reference
  fileRef.setAttrsFrom(attr);
}
