import { testables } from '../../src/ops/attributes';
import { testables as frontmatterTestables } from '../../src/ops/frontmatter';
import { FileRef } from '../../src/file-reference';
import { Spig } from '../../src/spig';
import * as SpigConfig from '../../src/spig-config';
import { fixtures } from '../_fixture/fixtures';

describe('attributes', () => {
  const processFile = testables.processFile;
  const srcDir = SpigConfig.dev.srcDir;

  beforeEach(() => {
    SpigConfig.dev.srcDir = fixtures.of_1();
  });

  afterEach(() => {
    SpigConfig.dev.srcDir = srcDir;
  });

  test('order', () => {
    let fileRef: FileRef = Spig.on().addFile('/dummy', 'Dummy');

    Spig.on('/**/*.txt').forEachFile((fr) => {
      fileRef = fr;
    });

    expect(fileRef).toBeDefined();

    fileRef.setAttr('xx', 77);
    fileRef.setAttr('yy', 0);

    // RUN
    frontmatterTestables.processFile(fileRef, {});
    processFile(fileRef, { yy: 44 });

    // attributes are top
    expect(fileRef.attr('gg')).toBe(100);
    expect(fileRef.attr('xx')).toBe(77);
    expect(fileRef.attr('yy')).toBe(44);

    // foo_.js(on)
    expect(fileRef.attr('ss')).toBe(4);
    expect(fileRef.attr('name')).toBe('foo.txt');
    // __.json
    expect(fileRef.attr('aa-1')).toBe(11);
    expect(fileRef.attr('aa-2')).toBe(99); // overwritten
    // _.json
    expect(fileRef.attr('bb-1')).toBe(33);
    expect(fileRef.attr('bb-2')).toBe(55); // overwritten
    expect(fileRef.attr('bb-3')).toBe(66); // overwritten

    expect(fileRef.attr('cc-1')).toBe(88);
    expect(fileRef.attr('cc-2')).toBe(22); // overwritten
  });
});
