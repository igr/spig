"use strict";

const nunjucks = require('nunjucks');
const SpigConfig = require('../spig-config');
const Meta = require('../meta');
const log = require('fancy-log');
const chalk = require('chalk');

const site = SpigConfig.site();

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
        if (options.filters.hasOwnProperty(name)) {
          let filter = options.filters[name];
          nunjucksEnv.addFilter(name, filter);
          log(chalk.magenta(logName) + " register filter: " + chalk.cyan(name));
        }
      }
    }
    if (options.globals) {
      for (const name in options.globals) {
        if (options.globals.hasOwnProperty(name)) {
          let value = options.globals[name];
          nunjucksEnv.addGlobal(name, value);
          log(chalk.magenta(logName) + " register global: " + chalk.cyan(name));
        }
      }
    }
  },

  render: (file) => {
    let string = file.contents.toString();

    const result = nunjucksEnv.renderString(string, Meta.context(file));

    file.contents = Buffer.from(result);
  },

  apply: (file, layout) => {
    let string = file.contents.toString();

    string = `{% extends '${layout}' %}` + string;

    const result = nunjucksEnv.renderString(string, Meta.context(file));

    file.contents = Buffer.from(result);
  }
};
