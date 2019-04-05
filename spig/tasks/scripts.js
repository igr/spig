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
  const site = SpigConfig.siteConfig;
  return gulp.src([site.srcDir + site.dirJs + '/**/*.js'])
    .pipe(plumber())
    .pipe(webpack({
      mode: 'production'
    }))
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(concat('main.js'))
    .pipe(gulpif(SpigConfig.devConfig.production, uglify()))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(site.outDir + site.dirJs))
    .pipe(browserSync.stream());
});
