import { getIEVersion, getChromeVersion } from './browser';

const IE_VERSION = getIEVersion();
const CHROME_VERSION = getChromeVersion();

const getFormattedTime = timestamp => {
  const date = new Date(timestamp || null);
  const y = date.getFullYear();
  const mo = String(date.getMonth() + 1).padStart(2, 0);
  const d = String(date.getDate()).padStart(2, 0);
  const h = String(date.getHours()).padStart(2, 0);
  const mi = String(date.getMinutes()).padStart(2, 0);
  const s = String(date.getSeconds()).padStart(2, 0);
  const ms = date.getMilliseconds();

  return `${y}-${mo}-${d} ${h}:${mi}:${s}.${ms}`;
};

const getFormattedTimes = timestamp => {
  const date = new Date(timestamp || null);
  const y = date.getFullYear();
  const mo = String(date.getMonth() + 1).padStart(2, 0);
  const d = String(date.getDate()).padStart(2, 0);
  const h = String(date.getHours()).padStart(2, 0);
  const mi = String(date.getMinutes()).padStart(2, 0);
  const s = String(date.getSeconds()).padStart(2, 0);
  // const ms = date.getMilliseconds();

  return `${y}-${mo}-${d} ${h}:${mi}:${s}`;
};

const getFormattedDate = timestamp => {
  const date = new Date(timestamp || null);
  const y = date.getFullYear();
  const mo = String(date.getMonth() + 1).padStart(2, 0);
  const d = String(date.getDate()).padStart(2, 0);

  return `${y}-${mo}-${d}`;
};

const getHourMinute = timestamp => {
  const date = new Date(timestamp || null);
  const h = String(date.getHours()).padStart(2, 0);
  const mi = String(date.getMinutes()).padStart(2, 0);

  return `${h}:${mi}`;
};

const formatDateStr = str => {
  if (IE_VERSION > 0) {
    return str.replace(' ', 'T').replace(/\+\d\d/, '');
  }

  if (CHROME_VERSION > 0 && CHROME_VERSION < 49) {
    return str.replace(/\+\d\d/, '');
  }

  return str;
};

export { getFormattedTime, getFormattedTimes, getFormattedDate, getHourMinute, formatDateStr };
