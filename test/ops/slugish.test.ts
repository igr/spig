import { hardReset } from '../../src/ctx';
import { FileRef } from '../../src/file-reference';
import { Spig } from '../../src/spig';
import { testables } from '../../src/ops/slugish';
import { fixtures } from '../_fixture/fixtures';

describe('slugish', () => {
  beforeEach(() => (hardReset().config.dev.srcDir = fixtures.of_1()));

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
