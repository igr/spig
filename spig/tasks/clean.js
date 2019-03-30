"use strict";

const gulp    = require('gulp');
const del     = require('del');
const SpigConfig = require('../spig-config');

// cleanups the build output

gulp.task('clean', () => {
  const site = SpigConfig.siteConfig;
  return del([
    site.outDir + '/**/*'
  ]);
});
