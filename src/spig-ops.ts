import { ctx } from './ctx.js';
import { SpigOperation } from './spig-operation.js';
import { slugit } from './util/slugit.js';

import { operation as attributes } from './ops/attributes.js';
import { operation as lang } from './ops/lang.js';
import { operation as excerpt } from './ops/excerpt.js';
import { operation as frontmatter } from './ops/frontmatter.js';
import { operation as htmlMinify } from './ops/htmlMinify.js';
import { operation as imageMinify } from './ops/imageMinify.js';
import { operation as collect } from './ops/collect.js';
import { operation as group } from './ops/group.js';
import { operation as js } from './ops/js.js';
import { operation as merge } from './ops/merge.js';
import { operation as permalinks } from './ops/permalinks.js';
import { operation as precss } from './ops/precss.js';
import { operation as readingtime } from './ops/readingtime.js';
import { operation as rename } from './ops/rename.js';
import { operation as render } from './ops/render.js';
import { operation as resizeImage } from './ops/resizeImage.js';
import { operation as sass } from './ops/sass.js';
import { operation as slugish } from './ops/slugish.js';
import { operation as template } from './ops/template.js';

type Spig = import('./spig.js').Spig;
type FileRef = import('./file-reference.js').FileRef;
type PathElements = import('./ops/rename.js').PathElements;

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

  frontmatter(): SpigOps {
    return this.op(frontmatter());
  }

  attributes(): SpigOps {
    return this.op(attributes());
  }

  lang(): SpigOps {
    return this.op(lang());
  }

  mark(attrName: string): SpigOps {
    return this.do(`mark: ${attrName}`, (fileRef) => fileRef.setAttr(attrName, true));
  }

  collect(singular: string, plural?: string): SpigOps {
    return this.op(collect(singular, plural ?? `${singular}s`));
  }

  group(
    attrName: string,
    attrsOf: (attrValue: string, files: FileRef[]) => object = () => {
      return {};
    }
  ): SpigOps {
    return this.op(group(attrName, attrsOf));
  }

  permalinks(): SpigOps {
    return this.op(permalinks());
  }

  slugish(): SpigOps {
    return this.op(slugish());
  }

  /**
   * Collects and group tags.
   */
  tags(): SpigOps {
    return this.group('tag', (attrValue, files: FileRef[]) => {
      const attrName = 'tag';

      const fileName = `/${slugit(attrName)}/${slugit(String(attrValue))}/index.html`;
      const attrFile = this.spig.addFile(fileName, attrValue);

      const result = {
        page: true,
        title: `${attrName}: ${attrValue}`,
        layout: attrName,
        group: files.map((fileRef) => fileRef.context()),
      };

      attrFile.setAttrsFrom(result);

      return result;
    });
  }

  imageMinify(options = {}): SpigOps {
    if (!ctx.config.site.build.production) {
      return this;
    }
    return this.op(imageMinify(options));
  }

  // --- renames ---

  rename(fn: (path: PathElements) => void): SpigOps {
    return this.op(rename(fn));
  }

  asHtml(): SpigOps {
    return this.rename((path) => {
      path.extname = '.html';
    });
  }

  // --- render & template ---

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
    return this.op(template());
  }

  htmlMinify(): SpigOps {
    if (!ctx.config.site.build.production) {
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

  precss(): SpigOps {
    return this.op(precss(this.spig));
  }

  merge(bundleAggregatorFn: (fileRef: FileRef) => string | undefined): SpigOps {
    return this.op(merge(this.spig, bundleAggregatorFn));
  }

  js(): SpigOps {
    return this.op(js(this.spig));
  }

  // SHORTCUTS

  /**
   * Shortcut for reading meta-data from page.
   */
  pageMeta(): SpigOps {
    return this.frontmatter().attributes().mark('page').collect('page');
  }

  /**
   * Setting the links for page.
   */
  pageLinks(): SpigOps {
    return this.lang().permalinks().slugish().asHtml();
  }

  /**
   * Shortcut for common asset initialization.
   */
  assetLinks(): SpigOps {
    return this.lang().slugish();
  }
}
