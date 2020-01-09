"use strict";

const SpigOperation = require('../spig-operation');
const rExcerpt2 = /<!--+\s*more\s*--+>/i;
const removeMd = require('remove-markdown');

const excerptBlock = (content) => {
  const match = rExcerpt2.exec(content);
  if (!match) {
    return;
  }
  return content.substring(0, match.index).trim();
};

function processFile(fileRef) {
  if (fileRef.attr.summary) {
    return;
  }

  let s = fileRef.contents;
  const data = excerptBlock(s);

  if (data) {
    s = removeMd(data);
  } else {
    s = removeMd(s);
    if (s.length > 140) {
      s = s.substr(0, 140) + '…';
    }
  }

  fileRef.attr.summary = s;
}

module.exports.operation = () => {
  return SpigOperation
    .named("summary")
    .onFile(fileRef => processFile(fileRef));
};
