"use strict";

const gulp = require('gulp');
const SpigConfig = require('../spig-config');
const browserSync = require('browser-sync').create();
const exec = require('child_process').exec;
const fs = require("fs");
const log = require('fancy-log');

require('require-dir')('.');

const dev = SpigConfig.dev;

gulp.task('browser-sync', () => {
  return browserSync.init({
    server: dev.outDir,
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

gulp.task('lambda', done => {
  const lambdaPath = dev.srcDir + dev.dirLambda;
  if (fs.existsSync(lambdaPath)) {
    exec('yarn build:lambda ' + lambdaPath, function (err, stdout, stderr) {
      log(stdout);
      log(stderr);
      done(err);
    });
  }
  else {
    log("Lambdas not detected, skipping");
    done();
  }
});

gulp.task('build', gulp.parallel(
  'static',
  'sass',
  'js',
  'images',
  'lambda',
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
