import * as SpigConfig from '../../src/spig-config';
import { FileRef } from '../../src/file-reference';
import { Spig } from '../../src/spig';
import { operation as slugish, testables } from '../../src/ops/slugish';

describe('slugish', () => {
  const srcDir = SpigConfig.dev.srcDir;

  beforeEach(() => {
    SpigConfig.dev.srcDir = 'test/_fixture';
  });

  afterEach(() => {
    SpigConfig.dev.srcDir = srcDir;
  });

  test('slug from name', async () => {
    const fileRef: FileRef = Spig.on().addFile('/dummy', 'Dummy');

    await slugish().onFile(fileRef);

    expect(fileRef).toBeDefined();

    expect(fileRef.out).toBe('/dummy');
    expect(fileRef.hasAttr('slug')).toBe(false);
  });

  // test('slug from slug attribute', async () => {
  //   const fileRef: FileRef = Spig.on().addFile('/dummy', 'Dummy');
  //   fileRef.setAttr('slug', '/foo');
  //
  //   await slugish().onFile(fileRef);
  //
  //   expect(fileRef).toBeDefined();
  //
  //   expect(fileRef.out).toBe('/foo');
  //   expect(fileRef.hasAttr('slug')).toBe(true);
  // });
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
