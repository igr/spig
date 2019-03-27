"use strict";

const log = require('fancy-log');
const chalk = require('chalk');
const gulp = require('gulp');
const through = require('through2');
const merge2 = require('merge2');
const Spig = require('../spig');
const SpigConfig = require('../spig-config');


// generate using SPIG

gulp.task('gen', () => {
  const stream = merge2();

  Spig.forEach((spig) => {
    let _gulp;

    spig
      .withFiles((files) => {
        _gulp = gulp.src(files);
        stream.add(_gulp);
      })
      .forEachTask((task) => {
        if (!_gulp) {
          throw new Error("Files set not defined");
        }
        _gulp.pipe(through.obj((file, enc, done) => {
          try {
            task(file);
          } catch (error) {
            log.error(error);
            file.error = error;
          }
          done(null, file);
        }));
      })
      .withOut((out) => {
        if (!_gulp) {
          throw new Error("Files set not defined");
        }

        // RENAME
        _gulp.pipe(through.obj((file, enc, done) => {
          if (file.meta && file.meta.out) {
            const site = SpigConfig.site();

            if (file.meta && file.meta.out) {
              // we are actually changing the source location!
              file.path = site.root + site.srcDir + site.dirSite + file.meta.out;
              if (file.sourceMap) {
                file.sourceMap.file = file.relative;
              }
            }
          }

          log(chalk.green(file.meta.out) + " <--- " + chalk.blue(file.meta.src));

          done(null, file);
        }));

        // END
        _gulp.pipe(gulp.dest(out));
      });
  });

  return stream;
});
