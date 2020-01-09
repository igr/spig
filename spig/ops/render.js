"use strict";

const SpigOperation = require('../spig-operation');
const SpigConfig = require('../spig-config');
const Path = require('path');

const render_nunjucks = require('./render-nunjucks');
const render_markdown = require('./render-markdown');

function processFile(fileRef) {
  const renderCfg = SpigConfig.ops.render;

  // match extension

  let matchedExtension = false;

  for (const ex of renderCfg.extensions) {
    if (fileRef.ext === ex) {
      matchedExtension = true;
      break;
    }
  }

  if (!matchedExtension) {
    return;
  }

  // render

  const ext = fileRef.ext;
  switch (ext) {
    case '.njk':
      render_nunjucks(fileRef);
      break;
    case '.md':
      render_markdown(fileRef);
      break;
    default:
      throw new Error(`No render engine for ${ext}.`);
  }
}

module.exports.operation = () => {
  return SpigOperation
    .named('render')
    .onFile((fileRef) => processFile(fileRef));
};
