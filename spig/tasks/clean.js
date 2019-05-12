"use strict";

const gulp    = require('gulp');
const del     = require('del');
const SpigConfig = require('../spig-config');

// cleanups the build output

gulp.task('clean', () => {
  return del([
    SpigConfig.dev.outDir + '/**/*'
  ]);
});
