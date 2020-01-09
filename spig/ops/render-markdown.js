"use strict";

const SpigFiles = require('../spig-files');
const md = require('../engines/markdown-engine');

const renderMarkdown = text => (text ? md.render(text) : '');
const markdownInline = text => (text ? md.renderInline(text) : '');

module.exports = file => {
  file.contents = md.render(SpigFiles.stringContents(file));

  file.attr = {
    ...file.attr,
    ...{
      markdown: renderMarkdown,
      markdownInline: markdownInline
    }
  };

};
