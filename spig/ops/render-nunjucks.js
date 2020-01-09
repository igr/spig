"use strict";

const nunjucksEnv = require('../engines/nunjucks-engine');

module.exports = fileRef => {
  let string = fileRef.string();

  fileRef.string(nunjucksEnv.renderString(string, fileRef.context()));
};

