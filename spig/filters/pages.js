"use strict";

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
   * Filters pages by a prefix.
   */
  within: (pages, prefix) => {
    const result = [];

    for (const page of pages) {
      if (page.src.startsWith(prefix)) {
        result.push(page);
      }
    }

    return result;
  },

  /**
   * Revers list of pages.
   */
  reverse: (pages) => {
    return pages.reverse();
  },

  /**
   * Sorts pages by given attribute(s).
   */
  sortBy: (pages, attr) => {
    const result = Object.values(pages);

    result.sort((a, b) => {
      const date1 = val(a, attr);
      const date2 = val(b, attr);

      if (date1 > date2) return 1;
      if (date1 < date2) return -1;
      return 0;
    });

    return result;
  },

  /**
   * Groups pages by given attribute(s) values.
   */
  groupBy: (pages, attr) => {
    const result = new Map();

    for (const p of pages) {
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
   * Groups pages by year of attribute(s).
   */
  groupByDateYear: (pages, attr) => {
    return groupByDate_Part(pages, attr, (date) => {
      return date.getFullYear();
    });
  },


  /**
   * Returns last N pages.
   */
  lastN: (pages, count) => {
    if (pages.length <= count) {
      return pages;
    }
    return pages.slice(pages.length - count);
  },

  /**
   * Returns first N pages.
   */
  firstN: (pages, count) => {
    if (pages.length <= count) {
      return pages;
    }
    return pages.slice(0, count);
  }

};
