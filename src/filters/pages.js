"use strict";


function groupByAttrDate_Part(pages, attr, dateconsumer) {
  const result = new Map();

  for (const p of pages) {
    const key = dateconsumer(p.page[attr]);
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

  within: (pages, prefix) => {
    const result = [];

    for (const page of pages) {
      if (page.src.startsWith(prefix)) {
        result.push(page);
      }
    }

    return result;
  },

  reverse: (pages) => {
    return pages.reverse();
  },

  sortByAttr: (pages, attr) => {
    const result = Object.values(pages);

    result.sort((a, b) => {
      const date1 = a.page[attr];
      const date2 = b.page[attr];

      if (date1 > date2) return 1;
      if (date1 < date2) return -1;
      return 0;
    });

    return result;
  },

  groupByAttr: (pages, attr) => {
    const result = new Map();

    for (const p of pages) {
      const key = p.page[attr];
      let value = result.get(key);

      if (!value) {
        value = [];
        result.set(key, value);
      }

      value.push(p);
    }

    return result;
  },

  groupByAttrDateYear: (pages, attr) => {
    return groupByAttrDate_Part(pages, attr, (date) => {
      return date.getFullYear();
    });
  },

};
