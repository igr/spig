"use strict";

const log = require("fancy-log");
const chalk = require("chalk");
const fs = require("fs");

var site = {
  name:    'spig site',
  version: '1.0.0',

  // main folders
  srcDir:       './src',
  outDir:       './out',

  // relative folders
  dirSite:      '/site',
  dirImages:    '/images',
  dirJs:        '/js',
  dirData:      '/data',
  dirCss:       '/css',
  dirStatic:    '/static',
  dirLayouts:   '/layouts',

  // images to be resized
  resizeImageSizes:  [400, 1000]
};

// update site config
if (fs.existsSync('./src/site.json')) {
  log("Reading " + chalk.blue("site.json"));
  const siteConfig = JSON.parse(fs.readFileSync('./src/site.json'));
  site = {...site, ...siteConfig};
}

const spigs = [];
class Spig {

  /* returns site defaults */
  static site() {
    return site;
  }

  /* iterates all SPIGs definitions */
  static forEach(fn) {
    spigs.forEach(fn);
  }

  static on(files) {
    const s = new Spig(files);
    spigs.push(s);
    return s;
  }

  constructor(files) {
    this.files = site.srcDir + site.dirSite + files;
    this.out = site.outDir;
    this.tasks = [];
    this.dev = process.env.NODE_ENV !== 'production';
  }

  /* uses a function to modify files */
  use(fn) {
    this.tasks.push(fn);
    return this;
  }

  /* defines custom out folder */
  out(folder) {
    this.out = site.outDir + folder;
    return this;
  }

  /* process files */
  withFiles(fn) {
    fn(this.files);
    return this;
  }

  withOut(fn) {
    fn(this.out);
    return this;
  }

  /* iterates all tasks */
  forEachTask(fn) {
    this.tasks.forEach(fn);
    return this;
  }

  // --- plugin commands ---

  frontmatter(attributes = {}) {
    const frontmatter = require('./fns/frontmatter');
    return this.use((file) => frontmatter(file, attributes));
  }

  markdown() {
    const markdown = require('./fns/markdown');
    return this.use((file) => markdown(file));
  }

  nunjucks() {
    const nunjucks = require('./fns/nunjucks');
    return this.use((file) => nunjucks(file));
  }

  debug() {
    const debug = require('./fns/debug');
    return this.use(debug);
  }

  initdata() {
    const initdata = require('./fns/initdata');
    return this.use(initdata);
  }

  folderize() {
    const folderize = require('./fns/folderize');
    return this.use((file) => folderize(file));
  }

}

module.exports = Spig;
