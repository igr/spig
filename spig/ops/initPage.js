"use strict";

const SpigOperation = require('../spig-operation');
const ctx = require('../ctx');

function addPageMethodsToSite(site) {

  // returns all pages
  site.pages = () => {
    if (!site._.pages) {
      site._.pages = [];
      ctx.forEachFile(fileRef => {
        if (fileRef.page) {
          site._.pages.push(fileRef.context())
        }
      });
    }
    return site._.pages;
  };

  // return page for given url
  site.pageOf = (url) => {
    for (const page of site.pages()) {
      if (page.url === url) {
        return page;
      }
    }
  };

  // return page for given src
  site.pageOfSrc = (src) => {
    for (const page of site.pages()) {
      if (page.src === src) {
        return page;
      }
    }
  };

}

module.exports.operation = (spig) => {
  return SpigOperation
    .named('init page')
    .onFile(fileRef => fileRef.page = true)
    .onEnd(() => {
      addPageMethodsToSite(spig.config().site);
    });
};
