"use strict";

const log = require('fancy-log');
const chalk = require('chalk');
const gulp = require('gulp');
const merge2 = require('merge2');
const Spig = require('../spig');
const SpigConfig = require('../spig-config');
const SpigFiles = require('../spig-files');
const Meta = require('../meta');
const glob = require('glob');


// generate using SPIG

gulp.task('gen', (done) => {

  // PHASE 1

  log(chalk.gray("PHASE 1"));

  Spig.forEach((spig) => {
    spig.withFiles((filesPatterns) => {
      spig.files = [];

      for (const pattern of filesPatterns) {
        for (const fileName of glob.sync(pattern)) {
          spig.files.push(fileName);

          const file = SpigFiles.createFileObject(fileName);

          spig.forEachTask((task) => {
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
      })
  });


  // PHASE 2

  log(chalk.gray("PHASE 2"));

  Spig.forEach((spig) => {

    for (const fileName of spig.files) {
      const file = SpigFiles.findFile(fileName);

      spig.forEachTask((task) => {
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

    log(chalk.green(out) + " <--- " + chalk.blue(file.path) + "    " + dest);
  });

  // the end
  done();
});
