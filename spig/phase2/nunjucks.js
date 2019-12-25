"use strict";

const nunjucks = require('nunjucks');
const dev = require('../spig-config').dev;
const SpigFiles = require('../spig-files');
const log = require('fancy-log');
const chalk = require('chalk');

const nunjucksEnv = nunjucks.configure(
  dev.srcDir + dev.dirLayouts, {
    autoescape: true
  }
);

const logName = 'nunjucks';

module.exports = {
  configure: (options) => {
    if (options.filters) {
      for (const name in options.filters) {
        if (options.filters.hasOwnProperty(name)) {
          let filter = options.filters[name];
          nunjucksEnv.addFilter(name, filter);
          log("Registering " + chalk.magenta(logName) + " filter: " + chalk.cyan(name));
        }
      }
    }
    if (options.globals) {
      for (const name in options.globals) {
        if (options.globals.hasOwnProperty(name)) {
          let value = options.globals[name];
          nunjucksEnv.addGlobal(name, value);
          log("Registering " + chalk.magenta(logName) + " global: " + chalk.cyan(name));
        }
      }
    }
  },

  render: (file) => {
    let string = SpigFiles.stringContents(file);

    file.contents = nunjucksEnv.renderString(string, SpigFiles.contextOf(file));
  },

  apply: (file, layout) => {
    let string = SpigFiles.stringContents(file);

    string = `{% extends '${layout}' %}` + string;

    file.contents = nunjucksEnv.renderString(string, SpigFiles.contextOf(file));
  }
};
