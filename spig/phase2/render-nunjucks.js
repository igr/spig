"use strict";

const nunjucksEnv = require('../engines/nunjucks-engine');
const SpigFiles = require('../spig-files');

module.exports = (file) => {
  let string = SpigFiles.stringContents(file);

  file.contents = nunjucksEnv.renderString(string, SpigFiles.contextOf(file));
};

