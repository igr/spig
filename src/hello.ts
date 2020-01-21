import _s from 'underscore.string';
import { Spig } from './spig';
import * as SpigConfig from './spig-config';

// This module is used in Spig, hence we have cyclic dependencies.
// It's harmless because Spig is already initialized and these functions
// are called only from a static method.

/**
 * IMAGES.
 */
export function images(): void {
  Spig.of(d =>
    d
      .on(['/**/*'])
      .from(SpigConfig.dev.dir.images)
      .to(SpigConfig.dev.dir.imagesOut)
  )
    ._('HELLO')
    .resizeImage()
    .imageMinify();
}

/**
 * STATIC.
 */
export function statics(): void {
  Spig.of(d =>
    d
      .on(['/**/*'])
      .from(SpigConfig.dev.dir.static)
      .to('/')
  )._('HELLO');
}

/**
 * SASS
 */
export function sass(): void {
  Spig.of(d =>
    d
      .on(['/**/*.s?ss'])
      .from(SpigConfig.dev.dir.css)
      .filter(fileRef => !fileRef.basename.startsWith('_'))
      .to(SpigConfig.dev.dir.cssOut)
  )
    ._('HELLO')
    .sass();
}

/**
 * JS
 */
export function js(): void {
  Spig.of(d =>
    d
      .on(['/**/*.js'])
      .from(SpigConfig.dev.dir.js)
      // skip bundles
      .filter(fileRef => !_s.contains(fileRef.path, '_js/'))
      .to(SpigConfig.dev.dir.jsOut)
  )
    ._('HELLO')
    .js();
}

export function jsBundles(): void {
  Spig.of(d =>
    d
      .on(['/*_js/**/*.js'])
      .from(SpigConfig.dev.dir.js)
      .to(SpigConfig.dev.dir.jsOut)
  )
    ._('HELLO')
    .merge(fileRef => {
      const slashNdx = fileRef.path.indexOf('/', 1);
      const bundleFileName = fileRef.path.substr(1, slashNdx - 1);
      if (_s.endsWith(bundleFileName, '_js')) {
        return bundleFileName.replace('_js', '.js');
      }
      return undefined;
    })
    .js();
}
