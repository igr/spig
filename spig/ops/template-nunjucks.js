"use strict";

const nunjucksEnv = require('../engines/nunjucks-engine');
const SpigFiles = require('../spig-files');

module.exports = (file, layout) => {
  let string = SpigFiles.stringContents(file);

  string = `{% extends '${layout}' %}` + string;

  const result = nunjucksEnv.renderString(string, SpigFiles.contextOf(file));

  file.contents = result;
};

