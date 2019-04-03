"use strict";

const SpigConfig = require('./spig-config');
const SpigFiles = require('./spig-files');
const LayoutResolver = require('./layout-resolver');
const Path = require('path');
const glob = require('glob');

// system debug errors

process.on('warning', e => console.warn(e.stack));
require('events').EventEmitter.prototype._maxListeners = 100;

// functions

const fn_frontmatter = require('./phase1/frontmatter');
const fn_initAttributes = require('./phase1/initAttributes');
const fn_folderize = require('./phase1/folderize');
const fn_slugish = require('./phase1/slugish');
const fn_renameExt = require('./phase1/renameExtension');
const fn_nunjucks = require('./phase2/nunjucks');
const fn_markdown = require('./phase2/markdown');
const fn_debug = require('./phase2/debug');
const fn_imageMinify = require('./phase2/imageMinify');
const fn_htmlMinify = require('./phase2/htmlMinify');

class Spig {

  /**
   * Creates new instance of Spig on give file set.
   */
  static on(files) {
    return new Spig(files);
  }

  constructor(files) {
    const site = SpigConfig.siteConfig;
    let filePatterns;

    if (Array.isArray(files)) {
      for (let i = 0; i < files.length; ++i) {
        const f = files[i];
        files[i] = site.srcDir + site.dirSite + f;
      }
      filePatterns = files;
    } else {
      filePatterns = [site.srcDir + site.dirSite + files];
    }

    // file names
    let allFiles = [];
    for (const pattern of filePatterns) {
      allFiles = allFiles.concat(glob.sync(pattern));
    }

    for (const fileName of allFiles) {
      this.addFile(fileName);
    }

    this.tasks = {
      1: [],
      2: []
    };
    this.out = site.outDir;
    this.dev = process.env.NODE_ENV !== 'production';
  }

  /**
   * Adds a real or virtual file.
   */
  addFile(fileName, value) {
    if (value) {
      const fo = SpigFiles.createFileObject(fileName, {virtual: true});
      fo.spig = this;
      fo.contents = Buffer.from(value);
      return fo;
    }
    const fo = SpigFiles.createFileObject(fileName);
    fo.spig = this;

    return fo;
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
    return this.use(1, (file) => fn_initAttributes(file, {page: true}));
  }

  initAsset() {
    return this.use(1, (file) => fn_initAttributes(file, {page: false}));
  }

  /**
   * @see fn_folderize
   */
  folderize() {
    return this.use(1, (file) => fn_folderize(file));
  }

  /**
   * @see fn_slugish
   */
  slugish() {
    return this.use(1, (file) => fn_slugish(file));
  }

  /**
   * Collects pages by given attribute name.
   */
  collect(attribute) {
    // avoid circular dependencies
    const fn_collect = require('./phase1/collect');
    return this.use(1, (file) => fn_collect(file, attribute));
  }

  /**
   * @see fn_imageMinify
   */
  imageMinify(options) {
    return this.use(2, (file) => fn_imageMinify(file, options));
  }


  // --- renames ---

  /**
   * @see fn_renameExt
   */
  as(extension) {
    return this.use(1, (file) => fn_renameExt(file, extension));
  }

  /**
   * @see as
   */
  asHtml() {
    return this.as('.html');
  }

  // --- render & template ---

  /**
   * Shortcut for common page initialization.
   */
  pageCommon() {
    return this
      .initPage()
      .folderize()
      .frontmatter()
      .slugish()
      .asHtml();
  }

  /**
   * Shortcut for common images initialization.
   */
  imagesCommon() {
    return this
      .initAsset()
      .slugish();
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
  applyTemplate() {
    return this.use(2, (file) => {
      const layout = LayoutResolver(file);

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

  /**
   * Minifies the HTML content.
   * @see fn_htmlMinify
   */
  htmlMinify(options) {
    return this.use(2, file => fn_htmlMinify(file, options));
  }

}

module.exports = Spig;
