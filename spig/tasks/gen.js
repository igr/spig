"use strict";

const log = require('fancy-log');
const chalk = require('chalk');
const gulp = require('gulp');
const through = require('through2');
const merge2 = require('merge2');
const Spig = require('../spig');
const SpigConfig = require('../spig-config');
const Meta = require('../meta');


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
          const out = Meta.out(file);
          if (out) {
            const site = SpigConfig.site();

            // we are actually changing the source location!
            file.path = site.root + site.srcDir + site.dirSite + out;
            if (file.sourceMap) {
              file.sourceMap.file = file.relative;
            }

          }

          log(chalk.green(out) + " <--- " + chalk.blue(Meta.src(file)));

          done(null, file);
        }));

        // END
        _gulp.pipe(gulp.dest(out));
      });
  });

  return stream;
});
