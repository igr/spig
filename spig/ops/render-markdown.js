"use strict";

const md = require('../engines/markdown-engine');

const renderMarkdown = text => (text ? md.render(text) : '');
const markdownInline = text => (text ? md.renderInline(text) : '');

module.exports = fileRef => {
  const content = md.render(fileRef.string());
  fileRef.string(content);

  fileRef.attr = {
    ...fileRef.attr,
    ...{
      markdown: renderMarkdown,
      markdownInline: markdownInline
    }
  };

};
