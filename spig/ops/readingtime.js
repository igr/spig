"use strict";

const readingTime = require('reading-time');
const SpigFiles = require('../spig-files');

/**
 * Reading time.
 */
module.exports = (file) => {
  const result = readingTime(SpigFiles.stringContents(file));

  const time = result.minutes;
  if (time < 1) {
    result.minutes = 1;
  } else {
    result.minutes = Math.round(time * 10) / 10;
  }

  delete result.text;

  file.attr.readingTime = result;
};
