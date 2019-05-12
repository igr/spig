"use strict";

/**
 * Safe dump.
 */
module.exports = (obj) => {
  if (obj) {
    delete obj.spig;
    delete obj.content;
    delete obj.site;
  }
  return JSON.stringify(obj);
};
