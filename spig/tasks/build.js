"use strict";

const gulp = require('gulp');
const SpigConfig = require('../spig-config');
const browserSync = require('browser-sync').create();
require('require-dir')('.');


gulp.task('browser-sync', () => {
  browserSync.init({
    server: SpigConfig.siteConfig.outDir,
    open: false,
    reloadOnRestart: true,
    watchOptions: {
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
  
  gulp.watch(site.srcDir + site.dirJs     + "/**/*", gulp.parallel('js'));
  gulp.watch(site.srcDir + site.dirImages + "/**/*", gulp.parallel('images'));
  gulp.watch(site.srcDir + site.dirCss    + "/**/*", gulp.parallel('sass'));
  gulp.watch(site.srcDir + site.dirStatic + "/**/*",  gulp.parallel('static'));
  gulp.watch(site.srcDir + site.dirSite + "/**/*", gulp.parallel('site'));
  gulp.watch(site.srcDir + site.dirLayouts + "/**/*", gulp.parallel('site'));

  gulp.watch(site.outDir + "/**/*").on('change', browserSync.reload);
});

gulp.task('dev', gulp.parallel(
  'browser-sync',
  gulp.series(
    'build',
    'watch',
  )
));

gulp.task('default', gulp.series('build'));
