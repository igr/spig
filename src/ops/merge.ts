import { SpigOperation } from '../spig-operation';
import { FileRef } from '../file-reference';

type Spig = import('../spig').Spig;

/**
 * Merges several files into one.
 * Provided `bundleAggregatorFn` must return result bundle name from given
 * file reference. Each bundle name will be added as bundle file to spig
 * with merged content of all bundled files.
 */
export function operation(spig: Spig, bundleAggregatorFn: (fileRef: FileRef) => string | undefined): SpigOperation {
  return new (class extends SpigOperation {
    private bundles: { [k: string]: string } = {};

    constructor() {
      super('merge');
      super.onStart = () => {
        this.bundles = {};
      };
      super.onFile = (fileRef: FileRef) => {
        const bundleFileName = bundleAggregatorFn(fileRef);
        if (!bundleFileName) {
          return;
        }

        let bundleContent = this.bundles[bundleFileName];
        if (!bundleContent) {
          bundleContent = '';
        }

        bundleContent += fileRef.string;

        this.bundles[bundleFileName] = bundleContent;

        spig.removeFile(fileRef);
      };
      super.onEnd = () => {
        Object.keys(this.bundles).forEach(bundleName => {
          const bundleContent = this.bundles[bundleName];
          spig.addFile(bundleName, bundleContent);
        });
      };
    }
  })();
}
