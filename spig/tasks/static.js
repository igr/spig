"use strict";

const gulp       = require('gulp');
const plumber    = require('gulp-plumber');
const SpigConfig = require('../spig-config');

gulp.task('static', () => {
  const site = SpigConfig.site();
  return gulp.src(
    [ site.srcDir + site.dirStatic + '/**/*' ],
    { base: site.srcDir + site.dirStatic + '/' })
    .pipe(plumber())
    .pipe(gulp.dest(site.outDir));
});
