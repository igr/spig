"use strict";

const SpigConfig = require('../spig-config');
const SpigFiles = require('../spig-files');
const slugify = require('slugify');

module.exports = (spig, file, attrName) => {
  if (!file.attr.hasOwnProperty(attrName)) {
    return;
  }

  let values = file.attr[attrName];

  if (!Array.isArray(values)) {
    values = [values];
  }

  const site = SpigConfig.site;
  let map = site.collections[attrName];

  if (!map) {
    // store new collection
    map = {};
    site.collections[attrName] = map;
    site.pageOfCollection = (collName, name) => {
      let fileName = `/${slugify(collName)}/${slugify(name)}/`;
      return site.pageOf(fileName);
    }
  }

  for (const v of values) {
    let attrFile;

    if (!map.hasOwnProperty(v)) {
      // first time collection is used
      map[v] = [];

      if (!site[attrName]) {
        site[attrName] = [];
      }
      site[attrName].push(v);

      const fileName = `/${slugify(attrName)}/${slugify(String(v))}/index.html`;

      attrFile = spig.addFile(fileName, v);

      attrFile.page = true;
      attrFile.attr.title = `${attrName}: ${v}`;
      attrFile.attr.layout = attrName;
    } else {
      const id = `/${slugify(attrName)}/${slugify(String(v))}/index`;

      attrFile = SpigFiles.lookup(id);
    }

    // update date

    if (file.attr.date) {
      if (!attrFile.attr.date) {
        attrFile.attr.date = file.attr.date;
      } else {
        if (file.attr.date > attrFile.attr.date) {
          attrFile.attr.date = file.attr.date;
        }
      }
    }

    map[v].push(SpigFiles.contextOf(file));
  }
};
