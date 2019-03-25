"use strict";

const nunjucks = require('nunjucks');
const Spig     = require('../spig');
const log      = require('fancy-log');
const chalk    = require('chalk');

const site = Spig.config().site();
const nunjucksEnv = nunjucks.configure(
  site.srcDir + site.dirLayouts,
  {
  autoescape: true
  }
);

module.exports = {
  configure: (options) => {
    if (options.filters) {
      for (const name in options.filters) {
        let filter = options.filters[name];
        nunjucksEnv.addFilter(name, filter);
        log(chalk.magenta("nunjucks>") + " register filter: " + chalk.cyan(name));
      }
    }
    if (options.globals) {
      for (const name in options.globals) {
        let value = options.globals[name];
        nunjucksEnv.addGlobal(name, value);
        log(chalk.magenta("nunjucks>") + " register global: " + chalk.cyan(name));
      }
    }
  },
  apply: (file) => {
    var string = file.contents.toString();
    if (file.data.layout) {
      string = `{% extends '${file.data.layout}' %}` + string;
    }

    const result = nunjucksEnv.renderString(
      string, {
        site: site,
        page: file.data
      });
    file.contents = Buffer.from(result);

    const filePath = file.path;
    file.path = filePath.substr(0, filePath.lastIndexOf(".")) + ".html";
  }
}
