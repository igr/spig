import { Spig } from '../../src/spig.js';
import { SpigCtx } from '../../src/ctx.js';

describe('site2', () => {
  beforeEach(() =>
    Spig.init((ctx: SpigCtx) => {
      const dev = ctx.config.dev;
      dev.srcDir = 'test/_fixture/2';
      dev.dryRun = true;
    })
  );

  test('common render flow', async () => {
    const s = Spig.of((def) => def.on(['/**/*.{md,njk}']));
    s._('META').pageMeta().pageLinks().summary()._('RENDER').render().applyTemplate();

    await Spig.runTask('build');

    let count = 0;
    s.forEachFile(() => {
      count += 1;
    });
    expect(count).toBe(1);

    let indexHtml = '';
    s.forEachFile((fileRef) => {
      if (fileRef.out === '/index.html') {
        indexHtml = fileRef.buffer.toString().trim();
      }
    });

    expect(indexHtml).toBe(
      `
<html><body>
name: Test2Site
summary: # First &quot;&gt;&#39; paragraph.
summary-safe: # First ">' paragraph.
summary-json: "# First \\">' paragraph."

<h1>Index</h1>
<p># First &quot;&gt;’ <em>paragraph</em>.</p>
<!--more-->
<p>Second paragraph.</p>


</body></html>`.trim()
    );
  });
});
