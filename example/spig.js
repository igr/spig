const { Spig, SpigSite } = require('spignite');

Spig.hello();

// PAGES

Spig
  .on('/**/*.{md,njk,pug}')
  .watchSite()

  ._BEFORE('PAGES')
  ._('PAGES')
  .pageMeta()
  .pageLinks()
  .tags()
  // repeat attributes reading as we want to read them for tags, too
  .attributes()
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
  ._('PAGES')
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
