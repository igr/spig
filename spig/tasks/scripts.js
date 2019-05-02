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
  const site = SpigConfig.site;
  return gulp.src([site.srcDir + site.dirJs + '/**/*.js'])
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
    .pipe(concat(SpigConfig.site.jsBundleName))
    .pipe(gulpif(SpigConfig.dev.production, uglify()))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(site.outDir + site.dirJs))
    .pipe(browserSync.stream());
});
