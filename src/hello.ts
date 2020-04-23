import _s from 'underscore.string';
import { SpigDef } from './spig-def';
import * as SpigConfig from './spig-config';

type Spig = import('./spig').Spig;
type SpigDefConsumer = (spigDefConsumer: (spigDef: SpigDef) => void) => Spig;

/**
 * IMAGES.
 */
export function images(SpigOf: SpigDefConsumer): void {
  const devDir = SpigConfig.dev.dir;

  SpigOf((d) => d.on(['/**/*']).from(devDir.images).to(devDir.imagesOut))
    .watch(devDir.images + '/**/*')
    ._('HELLO')
    .resizeImage()
    .imageMinify();
}

/**
 * STATIC.
 */
export function statics(SpigOf: SpigDefConsumer): void {
  const devDir = SpigConfig.dev.dir;

  SpigOf((d) => d.on(['/**/*']).from(devDir.static).to('/'))
    .watch(devDir.static + '/**/*')
    ._('HELLO');
}

/**
 * SASS.
 */
export function sass(SpigOf: SpigDefConsumer): void {
  const devDir = SpigConfig.dev.dir;

  SpigOf((d) =>
    d
      .on(['/**/*.s?ss'])
      .from(devDir.css)
      .filter((fileRef) => !fileRef.basename.startsWith('_'))
      .to(devDir.cssOut)
  )
    .watch(devDir.css + '/**/*')
    ._('HELLO')
    .sass();
}

/**
 * PRECSS.
 */
export function precss(SpigOf: SpigDefConsumer): void {
  const devDir = SpigConfig.dev.dir;

  SpigOf((d) =>
    d
      .on(['/**/*.css'])
      .from(devDir.css)
      .filter((fileRef) => !fileRef.basename.startsWith('_'))
      .to(devDir.cssOut)
  )
    .watch(devDir.css + '/**/*')
    ._('HELLO')
    .precss();
}

/**
 * JS
 */
export function js(SpigOf: SpigDefConsumer): void {
  const devDir = SpigConfig.dev.dir;

  SpigOf((d) =>
    d
      .on(['/**/*.js'])
      .from(devDir.js)
      // skip bundles
      .filter((fileRef) => !_s.contains(fileRef.path, '_js/'))
      .to(devDir.jsOut)
  )
    .watch(devDir.js + '/**/*')
    ._('HELLO')
    .js();
}

export function jsBundles(SpigOf: SpigDefConsumer): void {
  const devDir = SpigConfig.dev.dir;

  SpigOf((d) => d.on(['/*_js/**/*.js']).from(devDir.js).to(devDir.jsOut))
    .watch(devDir.js + '/**/*')
    ._('HELLO')
    .merge((fileRef) => {
      const slashNdx = fileRef.path.indexOf('/', 1);
      const bundleFileName = fileRef.path.substr(1, slashNdx - 1);
      if (bundleFileName.endsWith('_js')) {
        return bundleFileName.replace('_js', '.js');
      }
      return undefined;
    })
    .js();
}
