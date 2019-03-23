"use strict";

const nunjucks = require('nunjucks');
const Spig     = require('../spig');

const site = Spig.site();
nunjucks.configure(site.srcDir + site.dirLayouts, {
  autoescape: true
});

module.exports = (file, options) => {
  var string = file.contents.toString();

  if (file.data.layout) {
    string = `{% extends '${file.data.layout}' %}` + string;
  }

  const result = nunjucks.renderString(
    string, {
      site: site,
      page: file.data
    });
  file.contents = Buffer.from(result);

  const filePath = file.path;
  file.path = filePath.substr(0, filePath.lastIndexOf(".")) + ".html";
};
