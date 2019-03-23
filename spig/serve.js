"use strict";

const gulp    = require('gulp');
const serve   = require('gulp-serve');
const Spig    = require('./spig');

gulp.task('serve', serve({
  root: [Spig.site().outDir],
  port: 9000,
}));
