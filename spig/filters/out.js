"use strict";

/**
 * Safe, single-level dump.
 */
module.exports = (obj) => {
  return JSON.stringify(obj, function (k, v) { return k ? "" + v : v; });
};
