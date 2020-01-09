"use strict";

const SpigOperation = require('../spig-operation');
const readingTime = require('reading-time');

/**
 * Reading time.
 */
function processFile(fileRef) {
  const result = readingTime(fileRef.string());

  const time = result.minutes;
  if (time < 1) {
    result.minutes = 1;
  } else {
    result.minutes = Math.round(time * 10) / 10;
  }

  delete result.text;

  fileRef.attr.readingTime = result;
}

module.exports.operation = () => {
  return SpigOperation
    .named('reading time')
    .onFile(fileRef => processFile(fileRef));
};
