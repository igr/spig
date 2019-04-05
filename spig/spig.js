"use strict";

const SpigConfig = require('./spig-config');
const SpigFiles = require('./spig-files');
const SpigVersion = require('./spig-version');
const LayoutResolver = require('./layout-resolver');
const Path = require('path');
const glob = require('glob');
const log = require('fancy-log');

// system debug errors

process.on('warning', e => console.warn(e.stack));
require('events').EventEmitter.prototype._maxListeners = 100;

// functions

const fn_frontmatter = require('./phase1/frontmatter');
const fn_initAttributes = require('./phase1/initAttributes');
const fn_folderize = require('./phase1/folderize');
const fn_slugish = require('./phase1/slugish');
const fn_rename = require('./phase1/rename');
const fn_render_nunjucks = require('./phase2/render-nunjucks');
const fn_template_nunjucks = require('./phase2/template-nunjucks');
const fn_render_markdown = require('./phase2/render-markdown');
const fn_debug = require('./phase2/debug');
const fn_imageMinify = require('./phase2/imageMinify');
const fn_htmlMinify = require('./phase2/htmlMinify');
const fn_excerpt = require('./phase2/excerpt');

log(`-=[Spig v${SpigVersion}]=-`);

SpigConfig.configureEngines();

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
    if (!SpigConfig.devConfig.production) {
      return this;
    }
    return this.use(2, (file) => fn_imageMinify(file, options));
  }


  // --- renames ---

  /**
   * @see fn_renameExt
   */
  rename(fn) {
    return this.use(1, (file) => fn_rename(file, fn));
  }

  /**
   * Renames extension to HTML.
   */
  asHtml() {
    return this.rename(path => path.extname = '.html');
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
          fn_render_nunjucks(file);
          break;
        case '.md':
          fn_render_markdown(file);
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
          fn_template_nunjucks(file, layout);
          break;
        default:
          throw new Error("Unknown template engine for " + ext);
      }
    });
  }

  /**
   * Minifies the HTML content.
   * @see fn_htmlMinify
   */
  htmlMinify(options) {
    if (!SpigConfig.devConfig.production) {
      return this;
    }
    return this.use(2, file => fn_htmlMinify(file, options));
  }

  /**
   * Reads summary.
   */
  summary() {
    return this.use(2, file => fn_excerpt((file)));
  }

}

module.exports = Spig;
