"use strict";

const gulp       = require('gulp');
const plumber    = require('gulp-plumber');
const SpigConfig = require('../spig-config');
const browserSync = require('browser-sync').create();

gulp.task('static', () => {
  const site = SpigConfig.siteConfig;
  return gulp.src(
    [ site.srcDir + site.dirStatic + '/**/*' ],
    { base: site.srcDir + site.dirStatic + '/' })
    .pipe(plumber())
    .pipe(gulp.dest(site.outDir))
    .pipe(browserSync.stream());
});
