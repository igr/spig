import * as SpigConfig from './spig-config';
import { SpigOperation } from './spig-operation';
import { collect } from './ops/collect';

type Spig = import('./spig').Spig;
type FileRef = import('./file-reference').FileRef;

// OPERATIONS are loaded lazy

let opExcerpt: () => SpigOperation;
function excerpt(): SpigOperation {
  if (!opExcerpt) {
    opExcerpt = require('./ops/excerpt').operation;
  }
  return opExcerpt();
}

let opFrontmatter: () => SpigOperation;
function frontmatter(): SpigOperation {
  if (!opFrontmatter) {
    opFrontmatter = require('./ops/frontmatter').operation;
  }
  return opFrontmatter();
}

let opHtmlMinify: () => SpigOperation;
function htmlMinify(): SpigOperation {
  if (!opHtmlMinify) {
    opHtmlMinify = require('./ops/htmlMinify').operation;
  }
  return opHtmlMinify();
}

let opImageMinify: (options: object) => SpigOperation;
function imageMinify(options: object): SpigOperation {
  if (!opImageMinify) {
    opImageMinify = require('./ops/imageMinify').operation;
  }
  return opImageMinify(options);
}

let opGather: (singular: string, plural: string) => SpigOperation;
function gather(singular: string, plural: string): SpigOperation {
  if (!opGather) {
    opGather = require('./ops/gather').operation;
  }
  return opGather(singular, plural);
}

let opJs: () => SpigOperation;
function js(): SpigOperation {
  if (!opJs) {
    opJs = require('./ops/js').operation;
  }
  return opJs();
}

let opMerge: (spig: Spig, bundleAggregatorFn: (fileRef: FileRef) => string | undefined) => SpigOperation;
function merge(spig: Spig, bundleAggregatorFn: (fileRef: FileRef) => string | undefined): SpigOperation {
  if (!opMerge) {
    opMerge = require('./ops/merge').operation;
  }
  return opMerge(spig, bundleAggregatorFn);
}

let opPermalinks: () => SpigOperation;
function permalinks(): SpigOperation {
  if (!opPermalinks) {
    opPermalinks = require('./ops/permalinks').operation;
  }
  return opPermalinks();
}

let opReadingtime: () => SpigOperation;
function readingtime(): SpigOperation {
  if (!opReadingtime) {
    opReadingtime = require('./ops/readingtime').operation;
  }
  return opReadingtime();
}

let opRename: (renameFn: (parsedPath: PathElements) => void) => SpigOperation;
type PathElements = import('./ops/rename').PathElements;
function rename(renameFn: (parsedPath: PathElements) => void): SpigOperation {
  if (!opRename) {
    opRename = require('./ops/rename').operation;
  }
  return opRename(renameFn);
}

let opRender: () => SpigOperation;
function render(): SpigOperation {
  if (!opRender) {
    opRender = require('./ops/render').operation;
  }
  return opRender();
}

let opResizeImage: (spig: Spig) => SpigOperation;
function resizeImage(spig: Spig): SpigOperation {
  if (!opResizeImage) {
    opResizeImage = require('./ops/resizeImage').operation;
  }
  return opResizeImage(spig);
}

let opSass: (spig: Spig) => SpigOperation;
function sass(spig: Spig): SpigOperation {
  if (!opSass) {
    opSass = require('./ops/sass').operation;
  }
  return opSass(spig);
}

let opSlugish: () => SpigOperation;
function slugish(): SpigOperation {
  if (!opSlugish) {
    opSlugish = require('./ops/slugish').operation;
  }
  return opSlugish();
}

export class SpigOps {
  private readonly registerPhaseOp: (op: SpigOperation) => void;

  private readonly spig: Spig;

  constructor(spig: Spig, registerPhaseOp: (op: SpigOperation) => void) {
    this.spig = spig;
    this.registerPhaseOp = registerPhaseOp;
  }

  /**
   * Delegates to SPIG, so we can continue with the fluent interface.
   */
  _(phaseName: string): SpigOps {
    return this.spig._(phaseName);
  }

  /**
   * Defines single operation on current set of files.
   */
  op(operation: SpigOperation): SpigOps {
    this.registerPhaseOp(operation);
    return this;
  }

  /**
   * Defines single operation as a fileref consumer function.
   */
  do(name: string, operation: (fileRef: FileRef) => void): SpigOps {
    return this.op(SpigOperation.of(name, operation));
  }

  // operations
  // todo svima napravi options

  frontmatter(): SpigOps {
    return this.op(frontmatter());
  }

  initPage(): SpigOps {
    return this.op(gather('page', 'pages'));
  }

  gather(singular: string, plural: string): SpigOps {
    return this.op(gather(singular, plural));
  }

  permalinks(): SpigOps {
    return this.op(permalinks());
  }

  slugish(): SpigOps {
    return this.op(slugish());
  }

  /**
   * Collects pages by given attribute name and create page per attribute.
   */
  collect(attribute: string): SpigOps {
    return this.do('collect pages', fileRef => collect(this.spig, fileRef, attribute, true));
  }

  /**
   *
   * Collects pages by given attribute name, but don't generate pages per attributes.
   */
  collectAttr(attribute: string): SpigOps {
    return this.do('collect pages', fileRef => collect(this.spig, fileRef, attribute, false));
  }

  imageMinify(options = {}): SpigOps {
    if (!SpigConfig.site.build.production) {
      return this;
    }
    return this.op(imageMinify(options));
  }

  // --- renames ---

  rename(fn: (path: PathElements) => void): SpigOps {
    return this.op(rename(fn));
  }

  asHtml(): SpigOps {
    return this.rename(path => {
      path.extname = '.html';
    });
  }

  // --- render & template ---

  /**
   * Shortcut for common page initialization.
   */
  pageCommon(): SpigOps {
    return this.initPage()
      .permalinks()
      .frontmatter()
      .slugish()
      .asHtml();
  }

  /**
   * Shortcut for common asset initialization.
   */
  assetCommon(): SpigOps {
    return this.slugish();
  }

  /**
   * Renders a file using render engine determined by its extension.
   */
  render(): SpigOps {
    return this.op(render());
  }

  /**
   * Applies a template using template engine determined by layout extension.
   */
  applyTemplate(): SpigOps {
    return this.op(require('./ops/template').operation());
  }

  htmlMinify(): SpigOps {
    if (!SpigConfig.site.build.production) {
      return this;
    }
    return this.op(htmlMinify());
  }

  summary(): SpigOps {
    return this.op(excerpt());
  }

  readingTime(): SpigOps {
    return this.op(readingtime());
  }

  resizeImage(): SpigOps {
    return this.op(resizeImage(this.spig));
  }

  sass(): SpigOps {
    return this.op(sass(this.spig));
  }

  merge(bundleAggregatorFn: (fileRef: FileRef) => string | undefined): SpigOps {
    return this.op(merge(this.spig, bundleAggregatorFn));
  }

  js(): SpigOps {
    return this.op(js());
  }
}
