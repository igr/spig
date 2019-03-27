"use strict";

const log = require('fancy-log');
const chalk = require('chalk');
const gulp = require('gulp');
const Spig = require('../spig');
const SpigConfig = require('../spig-config');
const SpigFiles = require('../spig-files');
const glob = require('glob');
const fs = require('fs');
const Path = require('path');

// generate using SPIG

gulp.task('gen', (done) => {

  // PHASE 1

  log(chalk.gray("PHASE 1"));

  Spig.forEach((spig) => {

    spig.allfiles = [];

    for (const pattern of spig.files) {
      for (const fileName of glob.sync(pattern)) {
        spig.allfiles.push(fileName);

        const file = SpigFiles.createFileObject(fileName);

        spig.forEachTask(1, (task) => {
          try {
            task(file);
          } catch (error) {
            log.error(error);
            file.error = error;
          }
        });

        file.ok = true;
      }
    }
  });


  // PHASE 2

  log(chalk.gray("PHASE 2"));

  Spig.forEach((spig) => {

    for (const fileName of spig.allfiles) {
      const file = SpigFiles.findFile(fileName);

      spig.forEachTask(2, (task) => {
        try {
          task(file);
        } catch (error) {
          log.error(error);
          file.error = error;
        }
      })
    }
  });

  SpigFiles.forEach(file => {
    const out = file.out;
    const site = SpigConfig.site();
    const dest = site.root + site.outDir.substr(2) + out;

    fs.mkdirSync(Path.dirname(dest), {recursive: true});
    fs.writeFileSync(dest, file.contents);
    log(chalk.green(out) + " <--- " + chalk.blue(file.path) + "    " + dest);
  });

  // the end
  done();
});
