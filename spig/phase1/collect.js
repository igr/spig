"use strict";

const Spig = require('../spig');
const SpigConfig = require('../spig-config');
const slugify = require('slugify');

module.exports = (file, attrName) => {
  if (!file.attr.hasOwnProperty(attrName)) {
    return;
  }

  let values = file.attr[attrName];

  if (!Array.isArray(values)) {
    values = [values];
  }

  const site = SpigConfig.siteConfig;
  let map = site.collections[attrName];

  if (!map) {
    // store new collection
    map = {};
    site.collections[attrName] = map;
  }

  const spig = Spig.on();

  for (const v of values) {
    if (!map.hasOwnProperty(v)) {
      // first time collection is used
      map[v] = [];

      if (!site[attrName]) {
        site[attrName] = [];
      }
      site[attrName].push(v);

      const fileName = `/${attrName}/` + slugify(v);

      const file = spig.addFile(fileName + '/index.html', v);
      file.attr.layout = `${attrName}.njk`;

      //spig.initPage();
    }

    map[v].push(file);
  }

  spig.applyTemplate();
};
