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
export function keys(object: object): any[] {
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
export function groupBy(list: any[], attr: string): object {
  const result: any = {};

  for (const p of list) {
    const key = val(p, attr);
    let value = result[key];

    if (!value) {
      value = [];
      result[key] = value;
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
 * Returns last N elements of the list.
 */
export function lastN(list: any[], count: number): any[] {
  if (list.length <= count) {
    return list;
  }
  return list.slice(list.length - count);
}

/**
 * Returns first N elements of the list.
 */
export function firstN(list: any[], count: number): any[] {
  if (list.length <= count) {
    return list;
  }
  return list.slice(0, count);
}

/**
 * Filters elements and returns only those that have given attribute name.
 */
export function hasAttr(list: any[], attrName: string): any[] {
  return list.filter((e) => val(e, attrName) !== undefined);
}

/**
 * Filters elements and returns only those that have NOT given attribute name.
 */
export function hasNoAttr(list: any[], attrName: string): any[] {
  return list.filter((e) => val(e, attrName) === undefined);
}

/**
 * Filters elements and returns only those that have attribute name of given value.
 */
export function hasAttrVal(list: any[], attrName: string, value: string): any[] {
  return list.filter((e) => val(e, attrName) === value);
}

/**
 * Filters elements that starts with given prefix
 */
export function startsWith(list: any[], attrName: string, prefix: string): any[] {
  return list.filter((e) => {
    const value = val(e, attrName);
    if (value === undefined) {
      return false;
    }
    return value.toString().startsWith(prefix);
  });
}

export const testables = {
  val,
};
