"use strict";

/**
 * Utility method that resolves a value from a map using property name.
 */
function val(map, name) {
  const names = name.split('.');
  let result = map;
  for (const n of names) {
    result = result[n];
    if (!result) {
      break;
    }
  }
  return result;
}

function groupByDate_Part(pages, attr, dateconsumer) {
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


module.exports = {
  /**
   * Returns object's keys.
   */
  keys: object => {
    return Object.keys(object);
  },

  /**
   * Revers a list.
   */
  reverse: list => {
    return list.reverse();
  },

  /**
   * Sorts list of objects by given attribute(s).
   */
  sortBy: (list, attr) => {
    const result = Object.values(list);

    result.sort((a, b) => {
      const value1 = val(a, attr);
      const value2 = val(b, attr);

      if (value1 > value2) return 1;
      if (value1 < value2) return -1;

      return 0;
    });

    return result;
  },

  /**
   * Groups list of objects by given attribute(s) values.
   */
  groupBy: (list, attr) => {
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
  },

  /**
   * Groups list of objects by year of attribute(s).
   */
  groupByDateYear: (list, attr) => {
    return groupByDate_Part(list, attr, (date) => {
      return date.getFullYear();
    });
  },


  /**
   * Returns last N elements of a list.
   */
  lastN: (list, count) => {
    if (list.length <= count) {
      return list;
    }
    return list.slice(list.length - count);
  },

  /**
   * Returns first N elements of a list.
   */
  firstN: (list, count) => {
    if (list.length <= count) {
      return list;
    }
    return list.slice(0, count);
  }


};
