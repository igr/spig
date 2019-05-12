"use strict";

const gulp = require('gulp');
const SpigConfig = require('../spig-config');
const browserSync = require('browser-sync').create();
require('require-dir')('.');


gulp.task('browser-sync', () => {
  return browserSync.init({
    server: SpigConfig.dev.outDir,
    open: false,
    watchOptions: {
      ignoreInitial: true,
      ignored: '.DS_Store'
    }
  });
});

gulp.task('bs-reload', () => {
  browserSync.reload();
});

gulp.task('build', gulp.parallel(
  'static',
  'sass',
  'js',
  'images',
  'site'
));

gulp.task("watch", () => {
  const dev = SpigConfig.dev;

  gulp.watch(dev.srcDir + dev.dirJs + "/**/*", gulp.series('js'));
  gulp.watch(dev.srcDir + dev.dirImages + "/**/*", gulp.series('images'));
  gulp.watch(dev.srcDir + dev.dirCss + "/**/*", gulp.series('sass'));
  gulp
    .watch(dev.srcDir + dev.dirStatic + "/**/*", gulp.series('static'))
    .on('change', browserSync.reload);
  gulp
    .watch(dev.srcDir + dev.dirSite + "/**/*", gulp.series('site'))
    .on('change', browserSync.reload);
  gulp
    .watch(dev.srcDir + dev.dirLayouts + "/**/*", gulp.series('site'))
    .on('change', browserSync.reload);
});

gulp.task('dev', gulp.series(
  'build',
  gulp.parallel(
    'browser-sync',
    'watch',
  )
));

gulp.task('default', gulp.series('build'));
