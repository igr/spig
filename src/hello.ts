import _s from 'underscore.string';
import { SpigDef } from './spig-def';
import * as SpigConfig from './spig-config';

type Spig = import('./spig').Spig;
type SpigDefConsumer = (spigDefConsumer: (spigDef: SpigDef) => void) => Spig;

/**
 * IMAGES.
 */
export function images(SpigOf: SpigDefConsumer): void {
  SpigOf(d =>
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
export function statics(SpigOf: SpigDefConsumer): void {
  SpigOf(d =>
    d
      .on(['/**/*'])
      .from(SpigConfig.dev.dir.static)
      .to('/')
  )._('HELLO');
}

/**
 * SASS
 */
export function sass(SpigOf: SpigDefConsumer): void {
  SpigOf(d =>
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
export function js(SpigOf: SpigDefConsumer): void {
  SpigOf(d =>
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

export function jsBundles(SpigOf: SpigDefConsumer): void {
  SpigOf(d =>
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
