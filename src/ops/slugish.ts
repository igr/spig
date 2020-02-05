import Path from 'path';
import * as Mustache from 'mustache';
import { SpigOperation } from '../spig-operation';
import { FileRef } from '../file-reference';
import { SpigFiles } from '../spig-files';

function renderSlug(slug: string, fileRef: FileRef): string {
  return Mustache.render(slug, fileRef.context(), {}, ['{', '}']);
}

function resolvePathToFileIncludingSubSlugs(fileRef: FileRef): string {
  const dirName = Path.dirname(fileRef.out);

  const dirs = dirName.split('/').slice(1);
  let out = '/';
  let originalOutPath = '/';

  for (const dir of dirs) {
    let slug = dir;
    originalOutPath = originalOutPath + dir + '/';

    // if there is `index` file in current folder, it can change folder name
    // todo lookup for all input extensions, not only MD!

    const indexFileRef = SpigFiles.lookupSite(originalOutPath + 'index.md');

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
