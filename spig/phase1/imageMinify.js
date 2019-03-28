"use strict";

const imagemin = require('imagemin');
const imageminMozjpeg = require("imagemin-mozjpeg")
const imageminPngquant = require('imagemin-pngquant');
const imageminOptipng = require('imagemin-optipng');
const imageminGifsicle = require('imagemin-gifsicle');
const SpigConfig = require('../spig-config');

/**
 * Minimize images.
 */
module.exports = async (file) => {
  const site = SpigConfig.site();
  const outDir = site.outDir + file.dir;

  await imagemin([file.src], outDir, {
    use: [
      imageminMozjpeg({quality: 2}),
      imageminPngquant({quality: "65-80", speed: 4}),
      imageminOptipng({optimizationLevel: 3}),
      imageminGifsicle({optimizationLevel: 3})
    ]
  });

};
