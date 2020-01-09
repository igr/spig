"use strict";

const SpigConfig = require('../spig-config');
const SpigOperation = require('../spig-operation');
const imagemin = require('imagemin');
const imageminMozjpeg = require("imagemin-mozjpeg");
const imageminPngquant = require('imagemin-pngquant/index');
const imageminOptipng = require('imagemin-optipng');
const imageminGifsicle = require('imagemin-gifsicle');

/**
 * Minimizes images.
 */
function process(buffer, options = {}) {
  const defaults = SpigConfig.ops.imageMinify;

  const jpegOptions = {
    ...defaults.jpeg,
    ...options.jpeg
  };

  const pngOptions = {
    ...defaults.png,
    ...options.png
  };

  const optipngOptions = {
    ...defaults.optipng,
    ...options.optipng
  };

  const gifOptions = {
    ...defaults.gif,
    ...options.gif
  };

  return imagemin.buffer(buffer, {
    use: [
      imageminMozjpeg(jpegOptions),
      imageminPngquant(pngOptions),
      imageminOptipng(optipngOptions),
      imageminGifsicle(gifOptions)
    ]
  });
}

module.exports.operation = (options) => {
  return SpigOperation
    .named('minify images')
    .onFile((fileRef) => {
      return process(fileRef.buffer(), options)
        .then(buffer => {
          fileRef.buffer(buffer);
        });
    });
};
