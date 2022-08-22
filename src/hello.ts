import _s from 'underscore.string';
import { SpigDef } from './spig-def.js';
import { SpigConfig } from './spig-config.js';

type Spig = import('./spig.js').Spig;
type SpigDefConsumer = (spigDefConsumer: (spigDef: SpigDef) => void) => Spig;

/**
 * IMAGES.
 */
export function images(cfg: SpigConfig, SpigOf: SpigDefConsumer): void {
  const devDir = cfg.dev.dir;

  SpigOf((d) => d.on(['/**/*']).from(devDir.images).to(devDir.imagesOut))
    ._('HELLO')
    .resizeImage()
    .imageMinify();
}

/**
 * STATIC.
 */
export function statics(cfg: SpigConfig, SpigOf: SpigDefConsumer): void {
  const devDir = cfg.dev.dir;

  SpigOf((d) => d.on(['/**/*']).from(devDir.static).to('/'))._('HELLO');
}

/**
 * SASS.
 */
export function sass(cfg: SpigConfig, SpigOf: SpigDefConsumer): void {
  const devDir = cfg.dev.dir;

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
 * PRECSS.
 */
export function precss(cfg: SpigConfig, SpigOf: SpigDefConsumer): void {
  const devDir = cfg.dev.dir;

  SpigOf((d) =>
    d
      .on(['/**/*.css'])
      .from(devDir.css)
      .filter((fileRef) => !fileRef.basename.startsWith('_'))
      .to(devDir.cssOut)
  )
    ._('HELLO')
    .precss();
}

/**
 * JS.
 */
export function js(cfg: SpigConfig, SpigOf: SpigDefConsumer): void {
  const devDir = cfg.dev.dir;

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

export function jsBundles(cfg: SpigConfig, SpigOf: SpigDefConsumer): void {
  const devDir = cfg.dev.dir;

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
