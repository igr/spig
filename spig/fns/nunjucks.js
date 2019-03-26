"use strict";

const nunjucks = require('nunjucks');
const Spig = require('../spig');
const Meta = require('../meta');
const log = require('fancy-log');
const chalk = require('chalk');

const site = Spig.config().site();
const nunjucksEnv = nunjucks.configure(
  site.srcDir + site.dirLayouts, {
    autoescape: true
  }
);

const logName = 'nunjucks>';

module.exports = {
  configure: (options) => {
    if (options.filters) {
      for (const name in options.filters) {
        let filter = options.filters[name];
        nunjucksEnv.addFilter(name, filter);
        log(chalk.magenta(logName) + " register filter: " + chalk.cyan(name));
      }
    }
    if (options.globals) {
      for (const name in options.globals) {
        let value = options.globals[name];
        nunjucksEnv.addGlobal(name, value);
        log(chalk.magenta(logName) + " register global: " + chalk.cyan(name));
      }
    }
  },
  apply: (file) => {
    let string = file.contents.toString();

    const layout = Meta.attrOrMeta(file, 'layout');
    if (layout) {
      string = `{% extends '${layout}' %}` + string;
    }

    const result = nunjucksEnv.renderString(
      string, {
        content: file.contents,
        site: site,
        meta: file.meta,
        page: file.meta.attr
      });
    file.contents = Buffer.from(result);

    const filePath = file.meta.out;
    file.meta.out = filePath.substr(0, filePath.lastIndexOf(".")) + ".html";
  }
};
