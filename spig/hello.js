"use strict";

const Spig = require('./spig');
const SpigConfig = require('./spig-config');

/**
 * IMAGES.
 */
module.exports.images = () => {
  Spig
    .of(d => d
      .on('/**/*')
      .from(SpigConfig.dev.dirImages)
      .to(SpigConfig.dev.dirImagesOut)
    )
    ._('HELLO')
    .resizeImage()
    .imageMinify()
  ;
};

/**
 * STATIC.
 */
module.exports.static = () => {
  Spig
    .of(d => d
      .on('/**/*')
      .from(SpigConfig.dev.dirStatic)
      .to('/')
    )
    ._('HELLO')
  ;
};

/**
 * SASS
 */
module.exports.sass = () => {
  Spig
    .of(d => d
      .on('/**/*.s?ss')
      .from(SpigConfig.dev.dirCss)
      .filter(fileRef => !fileRef.basename.startsWith('_'))
      .to(SpigConfig.dev.dirCssOut)
    )
    ._('HELLO')
    .sass()
  ;
};

/**
 * JS
 */
module.exports.js = () => {
  Spig
    .of(d => d
      .on('/**/*.js')
      .from(SpigConfig.dev.dirJs)
      .to(SpigConfig.dev.dirJsOut)
    )
    ._('HELLO')
    .merge(SpigConfig.dev.names.bundle_js)
    .js()
  ;
};
