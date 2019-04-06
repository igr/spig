"use strict";

const Spig = require('../spig');
const SpigConfig = require('../spig-config');
const SpigFiles = require('../spig-files');
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
    site.pageOfCollection = (collName, name) => {
      let fileName = '/' + slugify(collName) + '/' + slugify(name) + '/';
      if (!SpigConfig.devConfig.permalinks) {
        fileName = fileName + 'index.html';
      }
      return site.pageOf(fileName);
    }
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

      const fileName = `/${slugify(attrName)}/` + slugify(v);

      const file = spig.addFile(fileName + '/index.html', v);

      file.page = true;
      file.attr.title = `${attrName}: ${v}`;
      file.attr.layout = attrName;
    }

    map[v].push(SpigFiles.contextOf(file));
  }

  spig.applyTemplate();
};
