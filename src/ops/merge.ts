import { SpigOperation } from '../spig-operation';
import { FileRef } from '../file-reference';

type Spig = import('../spig').Spig;

let bundles: { [k: string]: string } = {};

function processFile(spig: Spig, fileRef: FileRef, bundleAggregatorFn: (fileRef: FileRef) => string | undefined): void {
  const bundleFileName = bundleAggregatorFn(fileRef);
  if (!bundleFileName) {
    return;
  }

  let bundleContent = bundles[bundleFileName];
  if (!bundleContent) {
    bundleContent = '';
  }

  bundleContent += fileRef.string;

  bundles[bundleFileName] = bundleContent;

  spig.removeFile(fileRef);
}

function start(): void {
  bundles = {};
}

function end(spig: Spig): void {
  Object.keys(bundles).forEach(bundleName => {
    const bundleContent = bundles[bundleName];
    spig.addFile(bundleName, bundleContent);
  });
}

/**
 * Merges several files into one.
 * Provided `bundleAggregatorFn` must return result bundle name from given
 * file reference. Each bundle name will be added as bundle file to spig
 * with merged content of all bundled files.
 */

export const operation: (spig: Spig, bundleAggregatorFn: (fileRef: FileRef) => string | undefined) => SpigOperation = (
  spig: Spig,
  bundleAggregatorFn: (fileRef: FileRef) => string | undefined
) => {
  return new SpigOperation(
    'merge',
    fileRef => {
      processFile(spig, fileRef, bundleAggregatorFn);
      return Promise.resolve(fileRef);
    },
    () => start(),
    () => end(spig)
  );
};
