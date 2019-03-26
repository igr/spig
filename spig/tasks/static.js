"use strict";

const gulp       = require('gulp');
const plumber    = require('gulp-plumber');
const Spig         = require('../spig');

gulp.task('static', () => {
  const site = Spig.config().site();
  return gulp.src(
    [ site.srcDir + site.dirStatic + '/**/*' ],
    { base: site.srcDir + site.dirStatic + '/' })
    .pipe(plumber())
    .pipe(gulp.dest(site.outDir));
});
