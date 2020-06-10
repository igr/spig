import { slugit } from '../../src/util/slugit';

describe('slugit', () => {
  test('simple lowecase', () => {
    expect(slugit('Foo Bar')).toBe('foo-bar');
  });

  test('whitespaces', () => {
    expect(slugit('Foo       Bar')).toBe('foo-bar');
  });

  test('french', () => {
    expect(slugit('Un éléphant à l\'orée du bois')).toBe('un-elephant-a-loree-du-bois');
  });

  test('special chars', () => {
    expect(slugit('Foo!,;:[]{}"\'~bar')).toBe('foobar');
  });

  test('backslash is not replaced', () => {
    expect(slugit('foo/Bar')).toBe('foo/bar');
  });

  test('dash is not replaced', () => {
    expect(slugit('foo-Bar')).toBe('foo-bar');
  });
});
