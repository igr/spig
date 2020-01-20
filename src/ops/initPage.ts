import * as ctx from '../ctx';
import * as SpigConfig from '../spig-config';
import { SpigOperation } from '../spig-operation';
import { FileRef } from '../file-reference';

// todo any
function addPageMethodsToSite(site: any): void {
  // returns all pages
  site.pages = () => {
    if (!site._.pages) {
      site._.pages = [];
      ctx.forEachFile(fileRef => {
        if (fileRef.attr('page')) {
          site._.pages.push(fileRef.context());
        }
      });
    }
    return site._.pages;
  };

  // return page for given url
  site.pageOf = (url: string) => {
    for (const page of site.pages()) {
      if (page.url === url) {
        return page;
      }
    }
    return undefined;
  };

  // return page for given src
  site.pageOfSrc = (src: string) => {
    for (const page of site.pages()) {
      if (page.src === src) {
        return page;
      }
    }
    return undefined;
  };
}

export function operation(): SpigOperation {
  addPageMethodsToSite(SpigConfig.site);
  return SpigOperation.of('init page', (fileRef: FileRef) => {
    fileRef.setAttr('page', true);
  });
}
