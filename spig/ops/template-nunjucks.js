"use strict";

const nunjucksEnv = require('../engines/nunjucks-engine');

module.exports = (fileRef, layout) => {
  let string = fileRef.string();

  string = `{% extends '${layout}' %}` + string;

  const result = nunjucksEnv.renderString(string, fileRef.context());

  fileRef.contents = result;
};

