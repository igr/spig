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
      .from(SpigConfig.dev.dir.images)
      .to(SpigConfig.dev.dir.imagesOut)
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
      .from(SpigConfig.dev.dir.static)
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
      .from(SpigConfig.dev.dir.css)
      .filter(fileRef => !fileRef.basename.startsWith('_'))
      .to(SpigConfig.dev.dir.cssOut)
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
      .from(SpigConfig.dev.dir.js)
      .to(SpigConfig.dev.dir.jsOut)
    )
    ._('HELLO')
    .merge(SpigConfig.dev.names.bundle_js)
    .js()
  ;
};
