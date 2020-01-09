"use strict";

const ctx = require('../ctx');
const SpigRunner = require('../spig-runner');
const SpigConfig = require('../spig-config');
const SpigFiles = require('../spig-files');
const log = require('../log');
const fs = require('fs');
const Path = require('path');

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

  site.pageOf = (url) => {
    for (const page of site.pages) {
      if (page.url === url) {
        return page;
      }
    }
  };
  site.pageOfSrc = (src) => {
    for (const page of site.pages) {
      if (page.src === src) {
        return page;
      }
    }
  };

};


/**
 * Site updates only after a phase!
 */
const siteUpdate = () => {
  //collectAllPages();
};

/**
 * Reads all file content.
 */
const readAllFiles = () => {
  for (const file of SpigFiles.files) {
    if (file.src) {
      if (fs.existsSync(file.src)) {
        file.contents = fs.readFileSync(file.src);
        file.plain = file.contents.toString();
      } else {
        throw new Error("File not found: " + file.src);
      }
    }
  }
};

/**
 * Writes all destination files.
 */
const writeAllFiles = () => {
  log.line();

  for (const file of SpigFiles.files) {
    const dev = SpigConfig.dev;
    const out = file.out;
    const dest = Path.normalize(dev.root + dev.outDir + out);

    if (!fs.existsSync(Path.dirname(dest))) {
      fs.mkdirSync(Path.dirname(dest), {recursive: true});
    }

    if (typeof file.contents === 'string') {
      file.contents = Buffer.from(file.contents);
    }
    fs.writeFileSync(dest, file.contents);

    if (file.page) {
      log(chalk.green(out) + " <--- " + chalk.blue(file.path));
    }
  }
  const pageCount = SpigConfig.site.pages.length;
  if (pageCount !== 0) {
    logline();
  }
  log('Pages: ' + chalk.green(pageCount));
  log('Total files: ' + chalk.green(SpigFiles.files.length));
  log.line();
};

let counter = 0;

module.exports = () => {
  log.task("build");

  if (counter > 0) {
    reset();
  }

  counter = counter + 1;

//  readAllFiles();

  new SpigRunner(ctx.SPIGS, ctx.PHASES, ctx.OPS).run().catch(e => log.error(e));


//  writeAllFiles();

};
