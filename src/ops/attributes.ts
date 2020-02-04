import * as SpigConfig from '../spig-config';
import { SpigOperation } from '../spig-operation';
import { FileRef } from '../file-reference';
import { loadJsonOrJs } from '../load';

function processFile(fileRef: FileRef, attributes = {}): void {
  if (fileRef.src === undefined) {
    return;
  }

  const name = SpigConfig.dev.srcDir + fileRef.root + fileRef.dir + fileRef.basename + '_';

  const data = loadJsonOrJs(name, fileRef);

  attributes = { ...data, ...attributes };

  fileRef.setAttrsFrom(attributes);
}

export const operation: () => SpigOperation = () => {
  return SpigOperation.of('attributes', processFile);
};
