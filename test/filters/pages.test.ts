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

describe('pagesWithinSet', () => {
  const pagesWithinSet = pages.pagesWithinSet;
  const a = {
    src: '/a/bc',
  };
  const b = {
    src: '/a/b/d',
  };
  const c = {
    src: '/c/ba',
  };
  const d = {
    src: '/d/d',
  };
  const array = [a, b, c, d];

  test('filter path', () => {
    expect(pagesWithinSet(array, ['/a/', '/c/'])).toStrictEqual([a, b, c]);
    expect(pagesWithinSet(array, ['/a/', ])).toStrictEqual([a, b]);
    expect(pagesWithinSet(array, ['/c/', ])).toStrictEqual([c]);
    expect(pagesWithinSet(array, ['/a/', '/d/'])).toStrictEqual([a, b, d]);
  });
  test('filter empty', () => {
    expect(pagesWithinSet(array, ['/xxx/'])).toStrictEqual([]);
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
