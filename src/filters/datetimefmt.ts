import { DateTime } from 'luxon';

export function dateDisplay(dateObj: Date | string, format = 'LLL d, y'): string {
  if (typeof dateObj === 'string') {
    dateObj = new Date(dateObj);
  }
  return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat(format);
}

export function dateISO(dateObj: Date | string): string {
  if (typeof dateObj === 'string') {
    dateObj = new Date(dateObj);
  }
  return dateObj.toISOString();
}

export function dateUTC(dateObj: Date | string): string {
  if (typeof dateObj === 'string') {
    dateObj = new Date(dateObj);
  }
  return dateObj.toUTCString();
}
