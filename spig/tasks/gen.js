"use strict";

const gulp         = require('gulp');
const through      = require('through2');
const merge2       = require('merge2');
const Spig         = require('../spig');


// generate using SPIG

gulp.task('gen', (options = {}) => {
  const stream = merge2();

  Spig.forEach((spig) => {
    var _gulp;
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
            console.error(error);
            file.error = error;
          }
          done(null, file);
        }))
      })
      .withOut((out) => {
        if (!_gulp) {
          throw new Error("Files set not defined");
        }
        _gulp.pipe(gulp.dest(out));
      });
  });

  return stream;
});
