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
function process(buffer: Buffer, options: object): Promise<Buffer> {
  const defaults = SpigConfig.ops.imageMinify;

  const jpegOptions = {
    ...defaults.jpeg,
    ...(options as any).jpeg,
  };

  const pngOptions = {
    ...defaults.png,
    ...(options as any).png,
  };

  const optipngOptions = {
    ...defaults.optipng,
    ...(options as any).optipng,
  };

  const gifOptions = {
    ...defaults.gif,
    ...(options as any).gif,
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

export function operation(options: object): SpigOperation {
  return new SpigOperation('minify images', fileRef => {
    return process(fileRef.buffer, options).then((buffer: Buffer) => {
      fileRef.buffer = buffer;
      return fileRef;
    });
  });
}
