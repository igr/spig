import imagemin from 'imagemin';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminOptipng from 'imagemin-optipng';
import imageminPngquant from 'imagemin-pngquant';
import imageminGifsicle from 'imagemin-gifsicle';
import * as log from '../log.js';
import { SpigOperation } from '../spig-operation.js';
import { FileRef } from '../file-reference.js';

/**
 * Minimizes images.
 */
function process(fileRef: FileRef, options: any): Promise<Buffer> {
  const defaults = fileRef.cfg.ops.imageMinify;

  const jpegOptions = {
    ...defaults.jpeg,
    ...options.jpeg,
  };
  const jpegPlugin = imageminMozjpeg(jpegOptions);

  const pngOptions = {
    ...defaults.png,
    ...options.png,
  };
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore DEFAULT-ISSUE
  const pngPlugin = imageminPngquant(pngOptions);
  console.log(pngPlugin);

  const optipngOptions = {
    ...defaults.optipng,
    ...options.optipng,
  };
  const optiPlugin = imageminOptipng(optipngOptions);

  const gifOptions = {
    ...defaults.gif,
    ...options.gif,
  };
  const gifPlugin = imageminGifsicle(gifOptions);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore DEFAULT-ISSUE
  return imagemin.buffer(fileRef.buffer, {
    plugins: [jpegPlugin, pngPlugin, optiPlugin, gifPlugin],
  });
}

export const operation: (options: object) => SpigOperation = (options: object) => {
  return new SpigOperation('minify images', (fileRef) => {
    const imageMinifyOptions = fileRef.cfg.ops.imageMinify;
    const maxFileSize = (imageMinifyOptions as any).maxFileSize;

    if (maxFileSize > 0 && fileRef.bufferInputSize() > maxFileSize) {
      log.debug(`Skipping minifying image: ${fileRef.id}, too big`);
      return Promise.resolve(fileRef);
    }

    return process(fileRef, options).then(
      (buffer: Buffer) => {
        fileRef.buffer = buffer;
        return fileRef;
      },
      (err) => {
        log.error(`Error minifying image: ${fileRef.id}, skipping. ${err}`);
        return fileRef;
      }
    );
  });
};
