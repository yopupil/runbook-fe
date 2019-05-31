/**
 * Lightweight alternative to moment.js
 */

const DAY_MAP = {
  0: 'Sunday',
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday'
};

const MONTH_MAP = {
  0: 'January',
  1: 'February',
  2: 'March',
  3: 'April',
  4: 'May',
  5: 'June',
  6: 'July',
  7: 'August',
  8: 'September',
  9: 'October',
  10: 'November',
  11: 'December'
};

const CHAR_MAP = {
  M (date) {
    return date.getMonth();
  },
  MM (date) {
    return date.getMonth();
  },
  MMM (date) {
    return MONTH_MAP[date.getMonth()].slice(0, 3);
  },
  MMMM (date) {
    return MONTH_MAP[date.getMonth()];
  },
  Y (date) {
    return String(date.getFullYear()).slice(-2);
  },
  YY (date) {
    return String(date.getFullYear()).slice(-2);
  },
  YYY (date) {
    return String(date.getFullYear());
  },
  YYYY (date) {
    return String(date.getFullYear());
  },
  D (date) {
    return date.getDate();
  },
  DD (date) {
    return date.getDate() + 'th';
  },
  DDD (date) {
    return DAY_MAP[date.getDay()].slice(0, 3) + ' ' + date.getDate();
  },
  DDDD (date) {
    return DAY_MAP[date.getDay()] + ' ' + date.getDate();
  },
  h (date) {
    return date.getHours() % 12;
  },
  hh (date) {
    return date.getHours() % 12;
  },
  H (date) {
    return date.getHours();
  },
  HH (date) {
    return date.getHours();
  },
  m (date) {
    let minutes = date.getMinutes();
    if (minutes < 10) {
      minutes = '0' + minutes;
    }
    return minutes;
  },
  mm (date) {
    let minutes = date.getMinutes();
    if (minutes < 10) {
      minutes = '0' + minutes;
    }
    return minutes;
  },
  a (date) {
    return date.getHours() > 12 ? 'pm' : 'am';
  }
};

/**
 * Given time diff in milliseconds return an appropriate
 * human readable description
 * @param  {Number} timeDiffInMilliseconds Time difference in milliseconds
 * @return {String}                         Formattted string for human consumption
 */
export function formatTimeDelta (timeDiffInMilliseconds) {
  // Get in seconds
  let delta = timeDiffInMilliseconds / 1000;
  if (delta < 60) {
    return 'A few seconds ago';
  } else if (delta < 60 * 59) {
    const minutes = Math.round(delta / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (delta < 24 * 60 * 60) {
    const hours = Math.round(delta / (60 * 60));
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (delta < 365 * 24 * 60 * 60) {
    const days = Math.round(delta / (24 * 60 * 60));
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else {
    const years = Math.round(delta / (365 * 24 * 3600));
    return `${years} year${years > 1 ? 's' : ''} ago`;
  }
}

/**
 * Given a date object and format, format the date
 * accordingly
 *
 * @param  {Date} date       The date to be formatted
 * @param  {String} format   The format to format the date in
 * @return {String}          Date formatted according to format
 */
export function formatTime (date, format = 'MM/DD/YYYY') {
  if (typeof date === 'string') {
    // attempt to create a date
    date = new Date(date);
    if (isNaN(date)) {
      return '';
    }
  }
  if (!(date instanceof Date)) {
    return '';
  }
  let blacklist = [];
  Object.keys(CHAR_MAP)
    .sort(function (a, b) {
      return a.length < b.length ? 1 : -1;
    })
    .forEach(key => {
      for (let i = 0; i < blacklist.length; i++) {
        if (blacklist[i].indexOf(key) >= 0) {
          return;
        }
      }
      // If there was a match for a larger key, do not use the smaller ones
      if (format.indexOf(key) !== -1) {
        blacklist.push(key);
      }
      // Since format is changing in the process, we wanna detect
      format = format.replace(key, 'FGTX_' + key);
    });
  format = format.replace(/FGTX_\w+/g, function (match) {
    match = match.replace('FGTX_', '');
    return CHAR_MAP[match](date);
  });
  return format;
}

export function formatListDateTime (date) {
  const now = new Date();
  let result = '';

  if (typeof date === 'string') {
    // attempt to create a date
    date = new Date(date);
    if (isNaN(date)) {
      return '';
    }
  }

  // Doesn't validate date content
  if (date && date instanceof Date) {
    if (date.getYear() === now.getYear()) {
      if (
        date.getMonth() === now.getMonth() &&
        date.getDay() === now.getDay()
      ) {
        result = `Today ${date.toLocaleTimeString()}`;
      } else {
        result = formatTime(date, 'MMM D');
      }
    } else {
      result = formatTime(date, 'MMM D, YYYY');
    }
  }

  return result;
}

export function getTimeSinceToday (lastUpdatedISODate) {
  const date = new Date(lastUpdatedISODate);
  const dateDiff = Date.now() - date.getTime();
  if (dateDiff < 3600 * 1000) {
    // Less than 1 hour, so show the actual time, otherwise we have to update field dynamically
    return 'Today ' + formatTime(date, 'HH:mm a');
  }
  return formatTimeDelta(dateDiff);
}
