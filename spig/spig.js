"use strict";

const SpigConfig = require('./spig-config');
const Meta = require('./meta');
const Path = require('path');


// system debug errors
process.on('warning', e => console.warn(e.stack));
require('events').EventEmitter.prototype._maxListeners = 100;

// functions

const fn_nunjucks = require('./phase2/nunjucks');
const fn_frontmatter = require('./phase1/frontmatter');
const fn_markdown = require('./phase2/markdown');
const fn_debug = require('./phase2/debug');
const fn_initPage = require('./phase1/initpage');
const fn_initAsset = require('./phase1/initasset');
const fn_folderize = require('./phase1/folderize');
const fn_slugish = require('./phase1/slugish');
const fn_renameExt = require('./phase1/renameExtension');
const fn_imageMinify = require('./phase1/imageMinify');

const spigs = [];

class Spig {

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
    const site = SpigConfig.site();
    if (Array.isArray(files)) {
      this.files = files;
      const len = files.length;
      for (let i = 0; i < len; ++i) {
        const f = files[i];
        files[i] = site.srcDir + site.dirSite + f;
      }
    } else {
      this.files = [site.srcDir + site.dirSite + files];
    }

    this.out = SpigConfig.site().outDir;
    this.tasks = {
      1: [],
      2: []
    };
    this.dev = process.env.NODE_ENV !== 'production';
  }

  /**
   * Uses generic function to manipulate files.
   */
  use(phase, fn) {
    this.tasks[phase].push(fn);
    return this;
  }

  /**
   * Iterate all tasks of given phase.
   */
  forEachTask(phase, fn) {
    this.tasks[phase].forEach(fn);
    return this;
  }

  // --- function commands ---

  /**
   * @see fn_frontmatter
   */
  frontmatter(attributes = {}) {
    return this.use(1, (file) => fn_frontmatter(file, attributes));
  }

  /**
   * @see fn_debug
   */
  debug() {
    return this.use(2, fn_debug);
  }

  initPage() {
    return this.use(1, fn_initPage);
  }

  initAsset() {
    return this.use(1, fn_initAsset);
  }

  /**
   * @see fn_folderize
   */
  folderize() {
    return this.use(1, fn_folderize);
  }

  slugish() {
    return this.use(1, fn_slugish);
  }

  /**
   *
   * @see fn_imageMinify
   */
  imageMinify() {
    return this.use(1, fn_imageMinify);
  }


  // --- renames ---

  /**
   * @see fn_renameExt
   */
  as(extension) {
    return this.use(1, (file) => {
      fn_renameExt(file, extension);
    })
  }

  /**
   * @see as
   */
  asHtml() {
    return this.as('.html');
  }

  // --- render & template ---

  /**
   * Shortcut for common initialization.
   */
  init() {
    return this.initPage()
      .folderize()
      .frontmatter()
      .slugish()
      .asHtml()
  }

  /**
   * Renders a file using render engine determined by its extension.
   */
  render() {
    return this.use(2, (file) => {
      const ext = Path.extname(file.path);
      switch (ext) {
        case '.njk':
          fn_nunjucks.render(file);
          break;
        case '.md':
          fn_markdown(file);
          break;
      }
    });
  }

  /**
   * Applies a template using template engine determined by layout extension.
   */
  template() {
    return this.use(2, (file) => {
      const layout = Meta.attr(file, 'layout');
      const ext = Path.extname(layout);
      switch (ext) {
        case '.njk':
          fn_nunjucks.apply(file, layout);
          break;
        default:
          throw new Error("Unknown template engine.");
      }
    });
  }
}

module.exports = Spig;
