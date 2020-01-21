import imagemin from 'imagemin';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminOptipng from 'imagemin-optipng';
import imageminPngquant from 'imagemin-pngquant/index';
import imageminGifsicle from 'imagemin-gifsicle';

import * as SpigConfig from '../spig-config';

import { SpigOperation } from '../spig-operation';

/**
 * Minimizes images.
 */
function process(buffer: Buffer, options: any): Promise<Buffer> {
  const defaults = SpigConfig.ops.imageMinify;

  const jpegOptions = {
    ...defaults.jpeg,
    ...options.jpeg,
  };

  const pngOptions = {
    ...defaults.png,
    ...options.png,
  };

  const optipngOptions = {
    ...defaults.optipng,
    ...options.optipng,
  };

  const gifOptions = {
    ...defaults.gif,
    ...options.gif,
  };

  return imagemin.buffer(buffer, {
    plugins: [
      imageminMozjpeg(jpegOptions),
      imageminPngquant(pngOptions),
      imageminOptipng(optipngOptions),
      imageminGifsicle(gifOptions),
    ],
  });
}

export const operation: (options: object) => SpigOperation = (options: object) => {
  return new SpigOperation('minify images', fileRef => {
    return process(fileRef.buffer, options).then((buffer: Buffer) => {
      fileRef.buffer = buffer;
      return fileRef;
    });
  });
};
