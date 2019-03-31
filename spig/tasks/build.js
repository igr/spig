"use strict";

const gulp = require('gulp');
const SpigConfig = require('../spig-config');
const browserSync = require('browser-sync').create();
require('require-dir')('.');


gulp.task('browser-sync', () => {
  return browserSync.init({
    server: SpigConfig.siteConfig.outDir,
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
  const site = SpigConfig.siteConfig;

  gulp.watch(site.srcDir + site.dirJs + "/**/*", gulp.series('js'));
  gulp.watch(site.srcDir + site.dirImages + "/**/*", gulp.series('images'));
  gulp.watch(site.srcDir + site.dirCss + "/**/*", gulp.series('sass'));
  gulp
    .watch(site.srcDir + site.dirStatic + "/**/*", gulp.series('static'))
    .on('change', browserSync.reload);
  gulp
    .watch(site.srcDir + site.dirSite + "/**/*", gulp.series('site'))
    .on('change', browserSync.reload);
  gulp
    .watch(site.srcDir + site.dirLayouts + "/**/*", gulp.series('site'))
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
