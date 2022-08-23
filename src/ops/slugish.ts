import Path from 'path';
import Mustache from 'mustache';
import { SpigOperation } from '../spig-operation.js';
import { FileRef } from '../file-reference.js';
import { SpigFiles } from '../spig-files.js';
import { slugit } from '../util/slugit.js';

function renderSlug(slug: string, fileRef: FileRef): string {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore DEFAULT ISSUE
  return slugit(Mustache.render(slug, fileRef.context(), {}, ['{', '}']));
}

/**
 * When a file is located in a folder, we have to resolve possible
 * slug for any parent folder.
 */
function resolvePathToFileIncludingSubSlugs(fileRef: FileRef): string {
  const lang = fileRef.attr('lang');

  let fileRefOut = fileRef.out;
  let key = '';
  let out = '/';
  if (lang) {
    fileRefOut = fileRefOut.slice(lang.prefix.length);
    key = `.${lang.key}`;
    out = lang.prefix + '/';
  }
  const dirName = Path.dirname(fileRefOut);

  const dirs = dirName.split('/').slice(1);
  let originalOutPath = '/';

  for (const dir of dirs) {
    let slug = dir;
    originalOutPath = originalOutPath + dir + '/';

    // if there is `index` file in current folder, it can change folder name
    // todo lookup for all input extensions, not only MD!

    const indexFileRef = SpigFiles.lookupSite(originalOutPath + 'index' + key + '.md');

    if (indexFileRef) {
      if (indexFileRef.hasAttr('slug')) {
        slug = indexFileRef.attr('slug');
        slug = renderSlug(slug, indexFileRef);
      }
    }

    if (slug.startsWith('/')) {
      out = slug;
    } else {
      out += slug;
    }

    if (!out.endsWith('/')) {
      out += '/';
    }
  }

  return out;
}

function processFile(fileRef: FileRef): void {
  let out = resolvePathToFileIncludingSubSlugs(fileRef);

  let slug = fileRef.attr('slug');

  if (!slug) {
    // slug not defined on a file, return modified output path
    fileRef.out = out + Path.basename(fileRef.out);
    return;
  }

  slug = renderSlug(slug, fileRef);
  out = Path.dirname(out) + '/';

  if (slug.startsWith('/')) {
    fileRef.out = slug + '/' + Path.basename(fileRef.out);
    return;
  }

  fileRef.out = out + slug + '/' + Path.basename(fileRef.out);
}

export const operation: () => SpigOperation = () => {
  return SpigOperation.of('slugish', processFile);
};

export const testables = {
  renderSlug,
  processFile,
};
