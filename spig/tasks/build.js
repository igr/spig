"use strict";

const gulp = require('gulp');
const SpigConfig = require('../spig-config');
require('require-dir')('.');

gulp.task('build', gulp.parallel(
  'static',
  'sass',
  'js',
  'images',
  'gen'
));

gulp.task("watch", () => {
  const site = SpigConfig.site();
  gulp.watch(site.srcDir + site.dirJs     + "/**/*", gulp.parallel('js'));
  gulp.watch(site.srcDir + site.dirImages + "/**/*", gulp.parallel('images'));
  gulp.watch(site.srcDir + site.dirCss    + "/**/*", gulp.parallel('sass'));
  gulp.watch(site.srcDir + site.dirStatic + "/**/*",  gulp.parallel('static'));
  gulp.watch(site.srcDir + site.dirSite   + "/**/*",  gulp.parallel('gen'));
});

gulp.task('dev', gulp.series(
  'build',
  'watch',
));

gulp.task('default', gulp.series('build'));
