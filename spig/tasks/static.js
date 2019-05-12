"use strict";

const gulp       = require('gulp');
const plumber    = require('gulp-plumber');
const SpigConfig = require('../spig-config');
const browserSync = require('browser-sync').create();

gulp.task('static', () => {
  const dev = SpigConfig.dev;
  return gulp.src(
    [ dev.srcDir + dev.dirStatic + '/**/*' ],
    { base: dev.srcDir + dev.dirStatic + '/' })
    .pipe(plumber())
    .pipe(gulp.dest(dev.outDir))
    .pipe(browserSync.stream());
});
