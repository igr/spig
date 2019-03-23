"use strict";

const gulp    = require('gulp');
const Spig    = require('./spig');

gulp.task("watch", function () {
  const site = Spig.site();
  gulp.watch(site.srcDir + site.srcJs     + "/**/*", gulp.parallel('js'));
  gulp.watch(site.srcDir + site.srcImages + "/**/*", gulp.parallel('images'));
  gulp.watch(site.srcDir + site.srcCss    + "/**/*", gulp.parallel('sass'));
  gulp.watch(site.srcDir + site.srcStatic + "/**/*",  gulp.parallel('static'));
  gulp.watch(site.srcDir + site.srcSite   + "/**/*",  gulp.parallel('gen'));
});
