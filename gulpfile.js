"use strict";

const Spig = require('./spig/spig');
require('require-dir')('./spig/tasks');

// PAGES

Spig
  .on('/**/*.{md,njk}')

  ._("PREPARE")
  .pageCommon()
  .collect('tags')
  .collectAttr('menu')
  .readingTime()

  ._("RENDER")
  .summary()
  .render()
  .applyTemplate()
  .htmlMinify()
;

Spig
  .on()
  .with((s, site) => {
    for (let k in site.data.authors) {
      const po = s.addFile('/a/' + k, JSON.stringify(site.data.authors[k]));
      po.attr['title'] = k;
    }
  })
  ._("PREPARE")
  .pageCommon()

  ._("RENDER")
  .summary()
  .render()
  .applyTemplate()
  .htmlMinify()
;


// IMAGES

Spig
  .on('/**/*.{png,jpg,gif}')

  ._("PREPARE")
  .assetCommon()

  ._("ASSETS")
  .imageMinify()
;

// SITEMAP

Spig
  .on(['/index.xml', '/sitemap.xml'])
  ._("POST_RENDER")
  .frontmatter()
  .applyTemplate()
;

