import Path from 'path';
import { spigConfig } from '../ctx';
import { SpigOperation } from '../spig-operation';
import { FileRef } from '../file-reference';
import { loadJsonOrJs } from '../load';

/**
 * Reads attributes on path.
 */
function loadAttributes(fileRef: FileRef): object {
  let attr = {};

  let path = spigConfig.dev.srcDir + fileRef.root + fileRef.dir;

  while (true) {
    const config = loadJsonOrJs(path + '_', fileRef);

    // as we go deeper, don't overwrite, just add new attributes
    attr = { ...config, ...attr };

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

function processFile(fileRef: FileRef, attributes = {}): void {
  let attrs = {};

  // 1) _.JSON
  {
    const data = loadAttributes(fileRef);

    attrs = { ...attrs, ...data };
  }

  // 2) __.JSON
  {
    const name = spigConfig.dev.srcDir + fileRef.root + fileRef.dir + '__';
    const data = loadJsonOrJs(name, fileRef);

    attrs = { ...attrs, ...data };
  }

  // 3) FILE_.json
  if (fileRef.src !== undefined) {
    const name = spigConfig.dev.srcDir + fileRef.root + fileRef.dir + fileRef.basename + '_';
    const data = loadJsonOrJs(name, fileRef);

    attrs = { ...attrs, ...data };
  }

  // THE END
  fileRef.addAttrsFrom(attrs);
  fileRef.setAttrsFrom(attributes);
}

export const operation: () => SpigOperation = () => {
  return SpigOperation.of('attributes', processFile);
};

export const testables = {
  processFile,
};
