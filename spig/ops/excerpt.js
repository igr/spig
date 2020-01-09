"use strict";

const rExcerpt2 = /<!--+\s*more\s*--+>/i;
const removeMd = require('remove-markdown');

const excerptBlock = (content) => {
  const match = rExcerpt2.exec(content);
  if (!match) {
    return;
  }

  return content.substring(0, match.index).trim();
};

module.exports = (file) => {
  if (file.attr.summary) {
    return;
  }
  
  let s = file.contents;
  const data = excerptBlock(s);

  if (data) {
    s = removeMd(data);
  } else {
    s = removeMd(s);
    if (s.length > 140) {
      s = s.substr(0, 140) + '…';
    }
  }

  file.attr.summary = s;
};
