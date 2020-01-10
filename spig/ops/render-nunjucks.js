"use strict";

const nunjucksEnv = require('../engines/nunjucks-engine');
const log = require('../log');

module.exports = fileRef => {
  let content = fileRef.string();

  try {
    content = nunjucksEnv.renderString(content, fileRef.context());
    fileRef.string(content);
  } catch (err) {
    log.error(`Nunjucks Render failed for ${fileRef.path}`);
    throw err;
  }

};

