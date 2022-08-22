import { SpigCtx } from '../../src/ctx.js';
import { FileRef } from '../../src/file-reference.js';
import { Spig } from '../../src/spig.js';
import { testables } from '../../src/ops/slugish.js';

describe('slugish', () => {
  beforeEach(() =>
    Spig.init((ctx: SpigCtx) => {
      const dev = ctx.config.dev;
      dev.srcDir = '/test/_fixture/1';
      dev.dryRun = true;
    })
  );

  test('slug from name', () => {
    const fileRef: FileRef = Spig.on().addFile('/dummy', 'Dummy');

    testables.processFile(fileRef);

    expect(fileRef).toBeDefined();

    expect(fileRef.out).toBe('/dummy');
    expect(fileRef.hasAttr('slug')).toBe(false);
  });

  test('slug from slug attribute', async () => {
    const fileRef: FileRef = Spig.on().addFile('/dummy', 'Dummy');
    fileRef.setAttr('slug', '/foo-bar');

    testables.processFile(fileRef);

    expect(fileRef).toBeDefined();

    expect(fileRef.out).toBe('/foo-bar/dummy');
    expect(fileRef.hasAttr('slug')).toBe(true);
  });
});

describe('slugish render', () => {
  test('slug from fileRef', () => {
    const fileRef: FileRef = Spig.on().addFile('/dummy', 'Dummy');
    fileRef.setAttr('abc', 'AABBCC');

    expect(testables.renderSlug('hello{{ abc }}', fileRef)).toBe('helloaabbcc');

    fileRef.setAttr('title', 'Hello! This is World?');
    expect(testables.renderSlug('{{ title }}', fileRef)).toBe('hello-this-is-world');
  });
});
