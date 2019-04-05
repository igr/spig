"use strict";

const excerptHtml = require('excerpt-html');
const SpigFiles = require('../spig-files');

module.exports = (file) => {
  file.attr.summary = excerptHtml(SpigFiles.stringContents(file));
};
