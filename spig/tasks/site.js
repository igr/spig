"use strict";

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
  const result = task(file);
  if (result) {
    return result;
  }
  return new Promise(resolve => resolve());
};

/**
 * Resets all metadata and configuration to avoid accumulation on reloading.
 */
const reset = () => {
  SpigConfig.siteConfig.collections = {};
  SpigConfig.siteConfig.buildTime = new Date();

  for (const file of SpigFiles.files) {
    SpigFiles.resetMeta(file);
  }
};

/**
 * Runs single phase.
 */
const runPhase = (phaseNo) => {
  const phaseFiles = [];

  log(chalk.gray(`${logPrefix} PHASE ${phaseNo}`));

  for (const file of SpigFiles.files) {
    const p = [];
    file.spig.forEachTask(phaseNo, (task) => {
      p.push(runTask(task, file));
    });
    phaseFiles.push(Promise.all(p));
  }

  return Promise.all(phaseFiles);
};

const collectAllPages = () => {
  const site = SpigConfig.siteConfig;
  site.pages = [];
  for (const file of SpigFiles.files) {
    if (file.page) {
      site.pages.push(file);
    }
  }
};

const readAllFiles = () => {
  for (const file of SpigFiles.files) {
    if (file.src) {
      if (fs.existsSync(file.src)) {
        file.contents = fs.readFileSync(file.src);
      } else {
        throw new Error("File not found: " + fileName);
      }
    }
  }
};

function logline() {
  log('-----------------------------------------------------');
}

const writeAllFiles = () => {
  logline();
  for (const file of SpigFiles.files) {
    const site = SpigConfig.siteConfig;
    const out = file.out;
    const dest = Path.normalize(site.root + site.outDir + out);

    fs.mkdirSync(Path.dirname(dest), {recursive: true});
    fs.writeFileSync(dest, file.contents);

    if (file.page) {
      log(chalk.green(out) + " <--- " + chalk.blue(file.path));
    }
  }
  logline();
  log('Pages: ' + chalk.green(SpigConfig.siteConfig.pages.length));
  log('Files: ' + chalk.green(SpigFiles.files.length));
  logline();
};

gulp.task('site', (done) => {
  start()
    .then(() => reset())
    .then(() => readAllFiles())
    .then(() => runPhase(1))
    .then(() => collectAllPages())
    .then(() => runPhase(2))
    .then(() => {
      writeAllFiles();
      done();
    })
    .catch(reason => {
      log.error(reason);
    });
});
