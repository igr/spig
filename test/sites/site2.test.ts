import { fixtures } from '../_fixture/fixtures';
import { Spig } from '../../src';
import { SpigCtx } from '../../src/ctx';

describe('site2', () => {
  beforeEach(() =>
    Spig.init((ctx: SpigCtx) => {
      const dev = ctx.config.dev;
      dev.srcDir = fixtures.of_2();
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
Test2Site
First paragraph.

<h1>Index</h1>
<p>First <em>paragraph</em>.</p>
<!--more-->
<p>Second paragraph.</p>


</body></html>`.trim()
    );
  });
});
