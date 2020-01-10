"use strict";

const SpigOperation = require('../spig-operation');
const SpigConfig = require('../spig-config');
const Path = require('path');
const sass = require('node-sass');
const autoprefixer = require('autoprefixer');
const postcss = require('postcss');
const precss = require('precss');
const cssnano = require('cssnano');

function processFile(spig, fileRef) {
  // SASS -> CSS

  const cssResult = sass.renderSync({
    data: fileRef.string(),
    includePaths: [Path.dirname(fileRef.src)],
    sourceMap: true
  });

  let content = cssResult.css;

  // POSTCSS

  const p = postcss()
    .use(precss)
    .use(autoprefixer);

  if (SpigConfig.site.build.production) {
    p.use(cssnano);
  }

  return p.process(content, {
    from: fileRef.name,
    map: {
      inline: false,
      annotation: true,
    }
  })
    .then(result => {
      fileRef.outExt('css');
      fileRef.string(result.css);

      if (result.map) {
        spig.addFile(fileRef.out + '.map', result.map);
      }
    });
}


module.exports.operation = (spig) => {
  return SpigOperation
    .named('sass')
    .onFile((fileRef) => processFile(spig, fileRef));
};

