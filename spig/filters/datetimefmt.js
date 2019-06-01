"use strict";

const {DateTime} = require("luxon");

module.exports = {
  dateDisplay: (dateObj, format = "LLL d, y") => {
    if (typeof dateObj === 'string') {
      dateObj = new Date(dateObj);
    }
    return DateTime.fromJSDate(dateObj, {zone: "utc"}).toFormat(format);
  },

  dateISO: (dateObj) => {
    if (typeof dateObj === 'string') {
      dateObj = new Date(dateObj);
    }
    return dateObj.toISOString()
  },

  dateUTC: (dateObj) => {
    if (typeof dateObj === 'string') {
      dateObj = new Date(dateObj);
    }
    return dateObj.toUTCString()
  }
};
