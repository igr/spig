"use strict";

const SpigConfig = require('../spig-config');
const SpigFiles = require('../spig-files');
const log = require('fancy-log');
const chalk = require('chalk');
const gulp = require('gulp');
const fs = require('fs');
const Path = require('path');

// generate using SPIG

gulp.task('gen', (done) => {

  const site = SpigConfig.site();

  // PHASE 1

  log(chalk.gray("PHASE 1"));

  for (const file of SpigFiles.files) {
    file.spig.forEachTask(1, (task) => {
      try {
        task(file);
      } catch (error) {
        log.error(error);
        file.error = error;
      }
    });
  }

  // END PHASE 1

  // collect pages
  site.pages = [];
  for (const file of SpigFiles.files) {
    if (file.page) {
      site.pages.push(file);
    }
  }


  // PHASE 2

  log(chalk.gray("PHASE 2"));

  for (const file of SpigFiles.files) {
    file.spig.forEachTask(2, (task) => {
      try {
        task(file);
      } catch (error) {
        log.error(error);
        file.error = error;
      }
    })
  }

  // END PHASE 2

  for (const file of SpigFiles.files) {
    const out = file.out;
    const dest = Path.normalize(site.root + site.outDir + out);

    fs.mkdirSync(Path.dirname(dest), {recursive: true});
    fs.writeFileSync(dest, file.contents);

    log(chalk.green(out) + " <--- " + chalk.blue(file.path));
  }

  // the end
  done();
});
