import { Spig, SpigConfig } from 'spignite';

Spig.hello();

// PAGES

const pages = Spig.on('/**/*.{md,njk,pug}')

const files = Spig.on();
files.addFile("virtual.md", "# Virtual is _cool_!");

Spig.phase('PAGES', (on) => {
  on(pages)
    .pageMeta()
    .pageLinks()
    .tags()
    // repeat attributes reading as we want to read them for tags, too
    .attributes()
    .group('menu')
    .readingTime();

  on(files)
    .pageLinks();

});

Spig.phase('RENDER', (on) => {
  on(pages)
    .summary()
    .render()
    .applyTemplate()
    .htmlMinify();

  on(files)
    .render()
    .applyTemplate();
});


// Spig
//   .on('/**/*.{md,njk,pug}')
//
//   ._BEFORE('PAGES')
//   ._('PAGES')
//   .pageMeta()
//   .pageLinks()
//   .tags()
//   // repeat attributes reading as we want to read them for tags, too
//   .attributes()
//   .group('menu')
//   .readingTime()
//
//   ._('RENDER')
//   .summary()
//   .render()
//   .applyTemplate()
//   .htmlMinify()
// ;

Spig
  .on()
  .with((s) => {
    for (const k in SpigConfig.site.data.authors) {
      const file = s.addFile('/a/' + k, JSON.stringify(SpigConfig.site.data.authors[k]));
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
