"use strict";

const imagemin = require('imagemin');
const imageminMozjpeg = require("imagemin-mozjpeg")
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
module.exports = (file, options = {}) => {
  let jpegOptions = {
    ...jpgOptionsDefaults,
    ...options.jpeg
  };

  let pngOptions = {
    ...pngOptionsDefaults,
    ...options.png
  };

  let optipngOptions = {
    ...optipngOptionsDefaults,
    ...options.optipng
  };

  let gifOptions = {
    ...gifOptionsDefaults,
    ...options.gif
  };


  return imagemin.buffer(file.contents, {
    use: [
      imageminMozjpeg(jpegOptions),
      imageminPngquant(pngOptions),
      imageminOptipng(optipngOptions),
      imageminGifsicle(gifOptions)
    ]
  }).then(buffer => {
    file.contents = buffer;
  });
};
