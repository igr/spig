"use strict";

const ctx = require('../ctx');
const SpigRunner = require('../spig-runner');
const SpigConfig = require('../spig-config');
const SpigFiles = require('../spig-files');
const log = require('../log');
const fs = require('fs');

// todo cleanup!

/**
 * Resets all metadata and configuration to avoid accumulation on reloading.
 */
const reset = () => {
  const collections = SpigConfig.site.collections;
  Object.keys(collections).forEach(key => {
    delete SpigConfig.site[key];
  });

  SpigConfig.site.collections = {};
  SpigConfig.site.buildTime = new Date();

  const allSpigs = [];
  for (const file of SpigFiles.files) {
    if (!allSpigs.includes(file.spig)) {
      allSpigs.push(file.spig);
    }
  }

  SpigFiles.reset();

  for (const s of allSpigs) {
    s.reset();
  }

};

/**
 * Collects all pages.
 */
const collectAllPages = () => {
  const site = SpigConfig.site;
  site.pages = [];
  for (const file of SpigFiles.files) {
    if (file.page) {
      site.pages.push(SpigFiles.contextOf(file));
    }
  }
};


module.exports = () => {
  log.task("build");

  new SpigRunner(ctx.SPIGS, ctx.PHASES, ctx.OPS).run().catch(e => log.error(e));

};
