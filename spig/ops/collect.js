"use strict";

const SpigConfig = require('../spig-config');
const SpigFiles = require('../spig-files');
const slugify = require('slugify');

module.exports = (spig, fileRef, attrName, createFile) => {
  if (!fileRef.attr.hasOwnProperty(attrName)) {
    return;
  }

  let values = fileRef.attr[attrName];

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
      let fileName = `/${slugify(collName)}/${slugify(String(name))}/`;
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

      if (createFile) {
        attrFile = spig.addFile(fileName, v);

        attrFile.page = true;
        attrFile.attr.title = `${attrName}: ${v}`;
        attrFile.attr.layout = attrName;
      }
    } else {
      const id = `/${slugify(attrName)}/${slugify(String(v))}/index`;

      if (createFile) {
        attrFile = SpigFiles.lookup(id);
      }
    }

    // update date

    if (createFile) {
      if (fileRef.attr.date) {
        if (!attrFile.attr.date) {
          attrFile.attr.date = fileRef.attr.date;
        } else {
          if (fileRef.attr.date > attrFile.attr.date) {
            attrFile.attr.date = fileRef.attr.date;
          }
        }
      }
    }

    map[v].push(fileRef.context());
  }
};