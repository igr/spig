"use strict";

const gulp         = require('gulp');
const sass         = require('gulp-sass');
const sourcemaps   = require('gulp-sourcemaps');
const plumber      = require('gulp-plumber');
const autoprefixer = require('gulp-autoprefixer');
const cssnano      = require('gulp-cssnano');
const browserSync  = require('browser-sync').create();
const SpigConfig = require('../spig-config');

gulp.task('sass', () => {
  const site = SpigConfig.siteConfig;
  
  return gulp.src([site.srcDir + site.dirCss + '/**/*.s?ss' ])
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(sass())
      .on('error', sass.logError)
    .pipe(autoprefixer({
      browsers: [ 'last 3 versions', '> 0.5%' ]
    }))
    .pipe(cssnano())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(site.outDir + site.dirCss))
    .pipe(browserSync.stream());
});
