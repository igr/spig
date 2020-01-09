"use strict";

const SpigOperation = require('../spig-operation');
const imagemin = require('imagemin');
const imageminMozjpeg = require("imagemin-mozjpeg");
const imageminPngquant = require('imagemin-pngquant/index');
const imageminOptipng = require('imagemin-optipng');
const imageminGifsicle = require('imagemin-gifsicle');

const jpgOptionsDefaults = {
  quality: 85
};
const pngOptionsDefaults = {
  quality: [0.5, 0.8],
  speed: 4
};
const optipngOptionsDefaults = {
  optimizationLevel: 3
};
const gifOptionsDefaults = {
  optimizationLevel: 3
};

/**
 * Minimizes images.
 */
function invoke(buffer, options = {}) {
  const jpegOptions = {
    ...jpgOptionsDefaults,
    ...options.jpeg
  };

  const pngOptions = {
    ...pngOptionsDefaults,
    ...options.png
  };

  const optipngOptions = {
    ...optipngOptionsDefaults,
    ...options.optipng
  };

  const gifOptions = {
    ...gifOptionsDefaults,
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
      return invoke(fileRef.buffer(), options)
        .then(buffer => {
          fileRef.buffer(buffer);
        });
    });
};
