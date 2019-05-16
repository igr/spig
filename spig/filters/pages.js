"use strict";

module.exports = {

  /**
   * Filters pages by a prefix.
   */
  pagesWithin: (pages, prefix) => {
    const result = [];

    for (const page of pages) {
      if (page.src.startsWith(prefix)) {
        result.push(page);
      }
    }

    return result;
  }

};
