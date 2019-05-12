"use strict";

const gulp = require('gulp');
const gulpif = require('gulp-if');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const plumber = require('gulp-plumber');
const webpack = require('webpack-stream');
const babel = require('gulp-babel');
const browserSync = require('browser-sync').create();
const SpigConfig = require('../spig-config');

gulp.task('js', () => {
  const dev = SpigConfig.dev;

  SpigConfig.site.assets['js'] = {};
  SpigConfig.site.assets.js['dir'] = dev.dirJsOut;
  SpigConfig.site.assets.js['bundle'] = dev.dirJsOut + '/' + SpigConfig.dev.names.bundle_js;

  return gulp.src([dev.srcDir + dev.dirJs + '/**/*.js'])
    .pipe(plumber())
    .pipe(gulpif(SpigConfig.dev.jsUseBabel, webpack({
      mode: 'production'
    })))
    .pipe(sourcemaps.init())
    .pipe(gulpif(SpigConfig.dev.jsUseBabel, babel({
      presets: ['es2015', '@babel/env', {
        "targets": {
          "browsers": SpigConfig.dev.supportedBrowsers
        }
      }]
    })))
    .pipe(concat(SpigConfig.dev.names.bundle_js))
    .pipe(gulpif(SpigConfig.site.production, uglify()))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(dev.outDir + dev.dirJsOut))
    .pipe(browserSync.stream());
});
