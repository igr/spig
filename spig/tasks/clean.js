"use strict";

const gulp    = require('gulp');
const del     = require('del');
const SpigConfig = require('../spig-config');

// cleanups the build output

gulp.task('clean', () => {
  const site = SpigConfig.site();
  return del([
    site.outDir + '/**/*'
  ]);
});
