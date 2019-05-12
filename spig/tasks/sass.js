"use strict";

const gulp = require('gulp');
const gulpif = require('gulp-if');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const plumber = require('gulp-plumber');
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require('gulp-cssnano');
const browserSync = require('browser-sync').create();
const SpigConfig = require('../spig-config');

gulp.task('sass', () => {
  const dev = SpigConfig.dev;

  SpigConfig.site.assets['css'] = {};
  SpigConfig.site.assets.css['dir'] = dev.dirCssOut;

  return gulp.src([dev.srcDir + dev.dirCss + '/**/*.s?ss'])
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(autoprefixer({
      browsers: SpigConfig.dev.supportedBrowsers,
      cascade: false
    }))
    .pipe(gulpif(SpigConfig.site.production, cssnano()))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(dev.outDir + dev.dirCssOut))
    .pipe(browserSync.stream());
});
