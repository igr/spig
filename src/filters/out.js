"use strict";

module.exports = (obj) => {
  delete obj.spig;
  delete obj.content;
  delete obj.site;
  return JSON.stringify(obj);
};
