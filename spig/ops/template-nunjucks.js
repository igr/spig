"use strict";

const nunjucksEnv = require('../engines/nunjucks-engine');
const log = require('../log');

module.exports = (fileRef, layout) => {
  let string = fileRef.string();

  string = `{% extends '${layout}' %}` + string;

  try {
    const result = nunjucksEnv.renderString(string, fileRef.context());
    fileRef.string(result);
  } catch (err) {
    log.error(`Nunjucks Template failed for ${fileRef.path}`);
    throw err;
  }
};

