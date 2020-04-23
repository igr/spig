import { slugit } from '../../src/util/slugit';

describe('slugit', () => {
  test('simple lowecase', () => {
    expect(slugit('Foo Bar')).toBe('foo-bar');
  });

  test('special chars', () => {
    expect(slugit('Foo:Bar!')).toBe('foobar');
  });

  test('backslash is not replaces', () => {
    expect(slugit('foo/Bar')).toBe('foo/bar');
  });
});
