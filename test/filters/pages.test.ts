import * as pages from '../../src/filters/pages';

describe('pagesWithin', () => {
  const pagesWithin = pages.pagesWithin;
  const a = {
    src: '/a/bc',
  };
  const b = {
    src: '/a/b/d',
  };
  const c = {
    src: '/c/ba',
  };
  const array = [a, b, c];

  test('filter path', () => {
    expect(pagesWithin(array, '/a/')).toStrictEqual([a, b]);
  });
  test('filter empty', () => {
    expect(pagesWithin(array, '/xxx/')).toStrictEqual([]);
  });
});

describe('pagesWithinSubdirs', () => {
  const pagesWithinSubdirs = pages.pagesWithinSubdirs;
  const a = {
    src: '/a/bc',
  };
  const b = {
    src: '/a/b/d',
  };
  const c = {
    src: '/c/ba',
  };
  const array = [a, b, c];

  test('filter path', () => {
    expect(pagesWithinSubdirs(array, '/a/')).toStrictEqual([b]);
  });
  test('filter empty', () => {
    expect(pagesWithinSubdirs(array, '/xxx/')).toStrictEqual([]);
  });
});
