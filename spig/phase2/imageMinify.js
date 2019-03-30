"use strict";

const imagemin = require('imagemin');
const imageminMozjpeg = require("imagemin-mozjpeg")
const imageminPngquant = require('imagemin-pngquant/index');
const imageminOptipng = require('imagemin-optipng');
const imageminGifsicle = require('imagemin-gifsicle');

/**
 * Minimizes images.
 */
module.exports = (file, options = {}) => {
  let jpegQuality = 85;
  if (options.jpeg) {
    jpegQuality = options.jpeg;
  }
  let pngQuality = 3;
  if (options.png) {
    pngQuality = options.png;
  }
  let gifQuality = 3;
  if (options.gif) {
    gifQuality = options.gif;
  }

  return imagemin.buffer(file.contents, {
    use: [
      imageminMozjpeg({quality: jpegQuality}),
      imageminPngquant({quality: "65-80", speed: 4}),
      imageminOptipng({optimizationLevel: pngQuality}),
      imageminGifsicle({optimizationLevel: gifQuality})
    ]
  }).then(buffer => {
    file.contents = buffer;
  });
};
