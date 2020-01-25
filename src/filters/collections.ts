/* eslint-disable @typescript-eslint/no-explicit-any */

// These functions are executed by Nunjucks engine as filters and the input
// type is unknown, i.e. it's `any`.

/**
 * Utility method that resolves a value from a map using property name.
 */
function val(map: any, name: string): any | undefined {
  const names = name.split('.');
  let result = map;
  for (const n of names) {
    result = result[n];
    if (!result) {
      return undefined;
    }
  }
  return result;
}

function groupByDatePart(pages: any[], attr: string, dateconsumer: (date: Date) => number): object {
  const result = new Map();

  for (const p of pages) {
    const key = dateconsumer(val(p, attr));
    let value = result.get(key);

    if (!value) {
      value = [];
      result.set(key, value);
    }

    value.push(p);
  }

  return result;
}

/**
 * Returns object's keys.
 */
export function keys(object: {}): any[] {
  return Object.keys(object);
}

/**
 * Revers a list.
 */
export function reverse(list: any[]): any[] {
  return list.reverse();
}

/**
 * Sorts list of objects by given attribute(s).
 */
export function sortBy(list: any[], attr: string): any[] {
  const result = Object.values(list);

  result.sort((a, b) => {
    const value1 = val(a, attr);
    const value2 = val(b, attr);

    if (value1 > value2) return 1;
    if (value1 < value2) return -1;

    return 0;
  });

  return result;
}

/**
 * Groups list of objects by given attribute(s) values.
 */
export function groupBy(list: any[], attr: string): {} {
  const result = new Map();

  for (const p of list) {
    const key = val(p, attr);
    let value = result.get(key);

    if (!value) {
      value = [];
      result.set(key, value);
    }

    value.push(p);
  }

  return result;
}

/**
 * Groups list of objects by year of attribute(s).
 */
export function groupByDateYear(list: any[], attr: string): {} {
  return groupByDatePart(list, attr, (date: Date) => {
    return date.getFullYear();
  });
}

/**
 * Returns last N elements of a list.
 */
export function lastN(list: any[], count: number): any[] {
  if (list.length <= count) {
    return list;
  }
  return list.slice(list.length - count);
}

export function firstN(list: any[], count: number): any[] {
  if (list.length <= count) {
    return list;
  }
  return list.slice(0, count);
}
