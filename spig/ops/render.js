"use strict";

const SpigOperation = require('../spig-operation');
const SpigConfig = require('../spig-config');
const micromatch = require('micromatch');
const Path = require('path');

const render_nunjucks = require('./render-nunjucks');
const render_markdown = require('./render-markdown');

function processFile(fileRef) {
  if (!micromatch.isMatch(fileRef.path, SpigConfig.dev.render)) {
    return;
  }

  const ext = Path.extname(fileRef.path);
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
