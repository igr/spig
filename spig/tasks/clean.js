"use strict";

const gulp    = require('gulp');
const del     = require('del');
const Spig    = require('../spig');

// cleanups the build output

gulp.task('clean', () => {
  const site = Spig.config().site();
  return del([
    site.outDir + '/**/*'
  ]);
});
