"use strict";

const SpigOperation = require('../spig-operation');

/**
 * Merges several files into one.
 * Provided `bundleAggregatorFn` must return result bundle name from given
 * file reference. Each bundle name will be added as bundle file to spig
 * with merged content of all bundled files.
 */
module.exports.operation = (spig, bundleAggregatorFn) => {
  return SpigOperation
    .named('merge')
    .onStart(() => {
      this.bundles = {};
    })
    .onFile((fileRef) => {
      const bundleFileName = bundleAggregatorFn(fileRef);
      if (!bundleFileName) {
        return;
      }

      let bundleContent = this.bundles[bundleFileName];
      if (!bundleContent) {
        bundleContent = '';
      }

      bundleContent += fileRef.string();

      this.bundles[bundleFileName] = bundleContent;

      spig.removeFile(fileRef);
    })
    .onEnd(() => {
      for (const bundleName in this.bundles) {
        if (!this.bundles.hasOwnProperty(bundleName)) {
          continue;
        }
        const bundleContent = this.bundles[bundleName];
        spig.addFile(bundleName, bundleContent);
      }

    });
};

