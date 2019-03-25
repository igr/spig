"use strict";

const os          = require("os");
const gulp        = require('gulp');
const parallel    = require("concurrent-transform");
const rename      = require("gulp-rename");
const imageResize = require('gulp-image-resize');
const Spig        = require('./spig');

// creates a set of resize tasks at defined image widths

const site = Spig.config().site();
var resizeImageTasks = [];
site.resizeImageSizes.forEach(function(size) {
  var resizeImageTask = 'resize_' + size;
  gulp.task(resizeImageTask, function(done) {
    gulp.src(site.srcDir + site.dirImages + '/*')
    .pipe(parallel(
      imageResize({ width : size }),
      os.cpus().length
    ))
    .pipe(rename(function (path) { path.basename += "-" + size; }))
    .pipe(gulp.dest(site.outDir + site.dirImages));
    done();
  });
  resizeImageTasks.push(resizeImageTask);
});


// Copy core images to the dist folder and resize all preview images

gulp.task('images', gulp.parallel(resizeImageTasks, function copyOriginalImages(done) {
  gulp.src(site.srcDir + site.dirImages + '/*')
    .pipe(gulp.dest(site.outDir + site.dirImages))
    done();
}));
