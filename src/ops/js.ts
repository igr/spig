import uglify from 'uglify-js';
import babel from '@babel/core';
import * as SpigConfig from '../spig-config';
import { SpigOperation } from '../spig-operation';
import { FileRef } from '../file-reference';

function processFile(fileRef: FileRef): void {
  let bundleCode = fileRef.string;

  let result = babel.transformSync(bundleCode, {
    presets: ['@babel/preset-env', {}],
  });
  bundleCode = result.code;

  // uglify

  if (SpigConfig.site.build.production) {
    result = uglify.minify(bundleCode);
    if (result.error) {
      throw new Error(result.error);
    }
    bundleCode = result.code;
  }

  // update file reference

  fileRef.string = bundleCode;
}

export function operation(): SpigOperation {
  return new (class extends SpigOperation {
    constructor() {
      super('javascript');
      super.onFile = processFile;
    }
  })();
}
