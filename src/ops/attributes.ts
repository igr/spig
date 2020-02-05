import Path from 'path';
import * as SpigConfig from '../spig-config';
import { SpigOperation } from '../spig-operation';
import { FileRef } from '../file-reference';
import { loadJsonOrJs } from '../load';

/**
 * Reads attributes on path.
 */
function loadAttributes(fileRef: FileRef): object {
  let attr = {};

  let path = SpigConfig.dev.srcDir + fileRef.root + fileRef.dir;

  while (true) {
    const config = loadJsonOrJs(path + '_', fileRef);

    attr = { ...attr, ...config };

    const oldPath = path;

    path = Path.dirname(path);

    if (oldPath === './' && path === '.') {
      // this is the only way how we can be sure that
      // root has been processed once
      break;
    }

    if (!path.endsWith('/')) {
      path += '/';
    }
  }

  return attr;
}

export function processFile(fileRef: FileRef, attributes = {}): void {
  let attrs = {};

  if (fileRef.src !== undefined) {
    // 1) FILE_.json

    const name = SpigConfig.dev.srcDir + fileRef.root + fileRef.dir + fileRef.basename + '_';
    const data = loadJsonOrJs(name, fileRef);

    attrs = { ...attrs, ...data };
  }

  {
    // 2) __.JSON

    const name = SpigConfig.dev.srcDir + fileRef.root + fileRef.dir + '__';
    const data = loadJsonOrJs(name, fileRef);

    attrs = { ...attrs, ...data };
  }

  {
    // 3) _.JSON
    const data = loadAttributes(fileRef);

    attrs = { ...attrs, ...data };
  }

  // 4) INPUT ARGS

  attrs = { ...attrs, ...attributes };

  // THE END
  fileRef.setAttrsFrom(attrs);
}

export const operation: () => SpigOperation = () => {
  return SpigOperation.of('attributes', processFile);
};
