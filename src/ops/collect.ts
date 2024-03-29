import { ctx } from '../ctx.js';
import { SpigOperation } from '../spig-operation.js';

function returnAllPages(plural: string, singular: string) {
  return () => {
    const site: any = ctx.config.site;
    if (!site._[plural]) {
      site._[plural] = [];
      ctx.files((fileRef) => fileRef.hasAttr(singular)).forEach((fileRef) => site._[plural].push(fileRef.context()));
    }
    return site._[plural];
  };
}

function returnPageForGivenUrl(plural: string) {
  return (url: string) => {
    const site: any = ctx.config.site;
    for (const page of site[plural]()) {
      if (page.url === url) {
        return page;
      }
    }
    return undefined;
  };
}

function returnPageForGivenSrc(plural: string) {
  return (src: string) => {
    const site: any = ctx.config.site;
    for (const page of site[plural]()) {
      if (page.src === src) {
        return page;
      }
    }
    return undefined;
  };
}

function addMethodsToSite(singular: string, plural: string): void {
  const site: any = ctx.config.site;
  site[plural] = returnAllPages(plural, singular);
  site[singular + 'Of'] = returnPageForGivenUrl(plural);
  site[singular + 'OfSrc'] = returnPageForGivenSrc(plural);
}

export const operation: (singular: string, plural: string) => SpigOperation = (singular: string, plural: string) => {
  return new SpigOperation(
    `collect: ${plural}`,
    (fileRef) => Promise.resolve(fileRef),
    () => {},
    () => addMethodsToSite(singular, plural)
  );
};
