"use strict";

// Dynamic attributes are defined as JS function that returns an object.

module.exports = (file) => {
  let layout = "base.njk";

  if (file.name === 'index.xml') {
    layout = "";
  }

  return {
    "layout" : layout
  }
};
