"use strict";

const Spig = require('../spig');
const SpigConfig = require('../spig-config');
const SpigFiles = require('../spig-files');
const log = require('fancy-log');
const chalk = require('chalk');
const gulp = require('gulp');
const fs = require('fs');
const Path = require('path');

const logPrefix = 'Site';

/**
 * Runs SPIG tasks on files.
 */

const start = () => {
  return new Promise(resolve => resolve());
};

const runTask = (task, file) => {
  try {
    const result = task(file);
    if (result) {
      return result;
    }
    return new Promise(resolve => resolve());
  }
  catch (err) {
    log.error(chalk.red("Error! File: " + file.path));
    log.error(err);
    //throw err;
  }
};

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
    s.load();
  }

};

/**
 * Runs single phase.
 */
const runPhase = (phaseNo) => {
  const phaseFiles = [];

  log(chalk.gray(`${logPrefix} phase: ${phaseNo}`));

  for (const file of SpigFiles.files) {
    const p = [];
    file.spig.forEachTask(phaseNo, (task) => {
      p.push(runTask(task, file));
    });
    phaseFiles.push(Promise.all(p));
  }

  return Promise.all(phaseFiles);
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
  collectAllPages();
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
        throw new Error("File not found: " + fileName);
      }
    }
  }
};

function logline() {
  log('-----------------------------------------------------');
}

/**
 * Writes destination files.
 */
const writeAllFiles = () => {
  logline();
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
  logline();
};

let counter = 0;

gulp.task('site', (done) => {
  let promise = start();

  if (counter > 0) {
    promise = promise.then(() => reset());
  }
  counter = counter + 1;

  promise.then(() => readAllFiles());

  for (const phase of Spig.phases()) {
    promise = promise
      .then(() => runPhase(phase))
      .then(() => siteUpdate());
  }

  promise
    .then(() => {
      writeAllFiles();
      done();
    })
    .catch(reason => {
      log.error(reason);
    });
});
