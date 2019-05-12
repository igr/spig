"use strict";

const gulp    = require('gulp');
const serve   = require('gulp-serve');
const SpigConfig = require('../spig-config');

gulp.task('serve', serve({
  root: [SpigConfig.dev.outDir],
  port: 3000,
}));
