const { Spig } = require('spignite');

Spig.hello();

// PAGES

Spig
  .on('/**/*.{md,njk}')

  ._('PREPARE')
  .pageCommon()
  .collect('tags')
  .collectAttr('menu')
  .readingTime()

  ._('RENDER')
  .summary()
  .render()
  .applyTemplate()
  .htmlMinify()
;

// Spig
//   .on()
//   .with((s) => {
//     const site = s.config().site;
//     for (const k in site.data.authors) {
//       const po = s.addFile('/a/' + k, JSON.stringify(site.data.authors[k]));
//       po.attr['title'] = k;
//     }
//   })
//   ._("PREPARE")
//   .pageCommon()
//
//   ._("RENDER")
//   .summary()
//   .render()
//   .applyTemplate()
//   .htmlMinify()
// ;
//
//
// // IMAGES
//
// Spig
//   .on('/**/*.{png,jpg,gif}')
//
//   ._("PREPARE")
//   .assetCommon()
//
//   ._("ASSETS")
//   .imageMinify()
// ;
//
// // SITEMAP
//
// Spig
//   .on(['/index.xml', '/sitemap.xml'])
//   ._("POST_RENDER")
//   .frontmatter()
//   .applyTemplate()
// ;
//

Spig.run();
