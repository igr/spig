import uglify from 'uglify-js';
import * as babel from '@babel/core';
import { spigConfig } from '../ctx';
import { SpigOperation } from '../spig-operation';
import { FileRef } from '../file-reference';

type Spig = import('../spig').Spig;

function processFile(spig: Spig, fileRef: FileRef): Promise<FileRef> {
  let bundleCode = fileRef.string;

  let result = babel.transformSync(bundleCode, {
    presets: ['@babel/preset-env', {}],
    sourceMaps: true,
  });
  bundleCode = result.code;

  // source map
  if (result.map) {
    result.map.sources = [fileRef.id];
    spig.addFile(fileRef.out + '.map', JSON.stringify(result.map));
  }

  // uglify

  if (spigConfig.site.build.production) {
    result = uglify.minify(bundleCode);
    if (result.error) {
      throw new Error(result.error);
    }
    bundleCode = result.code;
  }

  // update file reference

  fileRef.string = bundleCode;

  return Promise.resolve(fileRef);
}

export const operation: (spig: Spig) => SpigOperation = (spig: Spig) => {
  return new SpigOperation('javascript', (fileRef: FileRef) => processFile(spig, fileRef));
};
