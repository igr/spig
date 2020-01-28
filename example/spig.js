const { Spig, SpigSite } = require('spignite');

Spig.hello();

// PAGES

Spig
  .on('/**/*.{md,njk}')
  .watchSite()

  ._('PAGES')
  .pageMeta()
  .pageLinks()
  .tags()
  .group('menu')
  .readingTime()

  ._('RENDER')
  .summary()
  .render()
  .applyTemplate()
  .htmlMinify()
;

Spig
  .on()
  .with((s) => {
    for (const k in SpigSite.data.authors) {
      const file = s.addFile('/a/' + k, JSON.stringify(SpigSite.data.authors[k]));
      file.setAttr('title', k);
      file.setAttr('page', true);
    }
  })
  ._('PREPARE')
  .pageMeta()
  .pageLinks()

  ._('RENDER')
  .summary()
  .render()
  .applyTemplate()
  .htmlMinify()
;


// IMAGES

Spig
  .on('/**/*.{png,jpg,gif}')

  ._('RENDER^BEFORE')
  .assetLinks()

  ._('ASSETS')
  .imageMinify()
;

// SITEMAP

Spig
  .on(['/index.xml', '/sitemap.xml'])
  ._("SITEMAP")
  .frontmatter()
  .applyTemplate()
;


Spig.run();
