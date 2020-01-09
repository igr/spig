"use strict";

const SpigOperation = require('../spig-operation');
const LayoutResolver = require('../layout-resolver');
const Path = require('path');

const template_nunjucks = require('./template-nunjucks');

function processFile(fileRef) {
  const layout = LayoutResolver(fileRef);

  const ext = Path.extname(layout);
  switch (ext) {
    case '.njk':
      template_nunjucks(fileRef, layout);
      break;
    default:
      throw new Error("Unknown template engine for " + ext);
  }
}

module.exports.operation = () => {
  return SpigOperation
    .named('template')
    .onFile((fileRef) => processFile(fileRef));
};
