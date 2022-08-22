import _s from 'underscore.string';
import { SpigDef } from './spig-def.js';
import { ctx } from './ctx.js';

type Spig = import('./spig.js').Spig;
type SpigDefConsumer = (spigDefConsumer: (spigDef: SpigDef) => void) => Spig;

/**
 * IMAGES.
 */
export function images(SpigOf: SpigDefConsumer): void {
  const devDir = ctx.config.dev.dir;

  SpigOf((d) => d.on(['/**/*']).from(devDir.images).to(devDir.imagesOut))
    ._('HELLO')
    .resizeImage()
    .imageMinify();
}

/**
 * STATIC.
 */
export function statics(SpigOf: SpigDefConsumer): void {
  const devDir = ctx.config.dev.dir;

  SpigOf((d) => d.on(['/**/*']).from(devDir.static).to('/'))._('HELLO');
}

/**
 * SASS.
 */
export function sass(SpigOf: SpigDefConsumer): void {
  const devDir = ctx.config.dev.dir;

  SpigOf((d) =>
    d
      .on(['/**/*.s?ss'])
      .from(devDir.css)
      .filter((fileRef) => !fileRef.basename.startsWith('_'))
      .to(devDir.cssOut)
  )
    ._('HELLO')
    .sass();
}

/**
 * JS.
 */
export function js(SpigOf: SpigDefConsumer): void {
  const devDir = ctx.config.dev.dir;

  SpigOf((d) =>
    d
      .on(['/**/*.js'])
      .from(devDir.js)
      // skip bundles
      .filter((fileRef) => !_s.contains(fileRef.path, '_js/'))
      .to(devDir.jsOut)
  )
    ._('HELLO')
    .js();
}

export function jsBundles(SpigOf: SpigDefConsumer): void {
  const devDir = ctx.config.dev.dir;

  SpigOf((d) => d.on(['/*_js/**/*.js']).from(devDir.js).to(devDir.jsOut))
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
