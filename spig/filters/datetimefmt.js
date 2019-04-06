"use strict";

const {DateTime} = require("luxon");

module.exports = {
  dateDisplay: (dateObj, format = "LLL d, y") => {
    return DateTime.fromJSDate(dateObj, {zone: "utc"}).toFormat(format);
  },

  dateISO: (dateObj) => dateObj.toISOString(),

  dateUTC: (dateObj) => dateObj.toUTCString()
};
