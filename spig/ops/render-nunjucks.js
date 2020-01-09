"use strict";

const nunjucksEnv = require('../engines/nunjucks-engine');
const SpigFiles = require('../spig-files');

module.exports = fileRef => {
  let string = SpigFiles.stringContents(fileRef);

  fileRef.contents = nunjucksEnv.renderString(string, SpigFiles.contextOf(fileRef));
};

