const debug = require('debug')('Time');
const Status = require('../views/Status');
const Format = require('../helpers/Format');

let instance = null;

function addLeadingZero(time) {
  return time < 10 ? `0${time}` : time;
}
/**
 * Time manupulation class
 * @class Time
 * @module Time
 */
class Time {
  /**
   * Create the singleton instance and set the current time
   * @constructor
   * @return {Object} The singleton instance
   */
  constructor() {
    if (!instance) {
      instance = this;
    }
    this.startTime = new Date();

    return instance;
  }

  /**
   * Get the time set in the creation of the first object
   * @method getStart
   * @return {String} The start time formated as hh:mm:ss
   */
  getStart() {
    const hours = this.startTime.getHours();
    const minutes = this.startTime.getMinutes();
    const seconds = this.startTime.getSeconds();

    return `${addLeadingZero(hours)}:${addLeadingZero(minutes)}:${addLeadingZero(seconds)}`;
  }

  /**
   * Convert a time string to miliseconds
   * @method milisecondsFromString
   * @param  {String}  time Time in the format hh:mm:ss
   * @return {Number}  the time in miliseconds
   */
  static milisecondsFromString(time) {
    const parts = time.split(':');
    if (parts.length === 1) {
      return (parts[0] * 1000);
    }
    if (parts.length === 2) {
      return ((parts[0] * 1000 * 60) + (parts[1] * 1000));
    }
    return ((parts[0] * 1000 * 60 * 60) + (parts[1] * 1000 * 60) + (parts[2] * 1000));
  }

  /**
   * Convert a miliseconds number to formated time
   * @method stringFromMiliseconds
   * @param  {Number}              time Miliseconds time number
   * @return {String} The time formated as hh:mm:ss
   */
  static timeStringFromDate(date) {
    return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  }

  /**
   * Convert a miliseconds number to formated time
   * @method stringFromMiliseconds
   * @param  {Number}              time Miliseconds time number
   * @return {String} The time formated as hh:mm:ss
   */
  static stringFromMiliseconds(time) {
    let mili = time;

    const hours = Math.floor(mili / 1000 / 60 / 60);
    mili -= hours * 1000 * 60 * 60;
    const minutes = Math.floor(mili / 1000 / 60);
    mili -= minutes * 1000 * 60;
    const seconds = Math.floor(mili / 1000);

    return `${addLeadingZero(hours)}:${addLeadingZero(minutes)}:${addLeadingZero(seconds)}`;
  }

  /**
   * Calculates the time difference from two time strings
   * @method diffFromString
   * @param  {String}       start The start time in the format hh:mm:ss
   * @param  {String}       end   The end time in the format hh:mm:ss
   * @return {Number}       Miliseconds difference
   */
  static diffFromString(start, end) {
    const splitStr = start.split(':');
    const splitEnd = end.split(':');
    const strTime = new Date(0, 0, 0, splitStr[0], splitStr[1], splitStr[2]);
    const endTime = new Date(0, 0, 0, splitEnd[0], splitEnd[1], splitEnd[2]);
    return endTime.getTime() - strTime.getTime();
  }

  /**
   * Summ the time from two time strings
   * @method diffFromString
   * @param  {String}       start       The start time in the format hh:mm:ss
   * @param  {String}       increment   The time that must be added in the format hh:mm:ss
   * @return {String}       The time after the summ in the format hh:mm:ss
   */
  static add(start, increment) {
    const times = [];
    const splitStr = start.split(':');
    const splitIncrm = increment.split(':');

    for (let i = 0; i < 3; i += 1) {
      splitStr[i] = (isNaN(parseInt(splitStr[i], 10))) ? 0 : parseInt(splitStr[i], 10);
      splitIncrm[i] = (isNaN(parseInt(splitIncrm[i], 10))) ? 0 : parseInt(splitIncrm[i], 10);
      times[i] = splitStr[i] + splitIncrm[i];
    }

    let hours = times[0];
    let minutes = times[1];
    let seconds = times[2];


    if (seconds >= 60) {
      minutes += parseInt(seconds / 60, 10);
      seconds %= 60;
    }

    if (minutes >= 60) {
      hours += parseInt(minutes / 60, 10);
      minutes %= 60;
    }

    return `${addLeadingZero(hours)}:${addLeadingZero(minutes)}:${addLeadingZero(seconds)}`;
  }

  /**
   * Get the final time, after all reminder times
   * @method getFinal
   * @param  {String} startTime      The start time formated in as hh:mm:ss
   * @param  {Array} incrementArray  The timeTable array with all reminders
   * @param  {Boolean} log           If the log with the alerts should be displayed
   * @return {String} The fnal time formated as hh:mm:ss
   */
  static getFinal(startTime, incrementArray, log) {
    let time = startTime;
    let counter = 1;
    incrementArray.forEach((increment) => {
      const start = time;
      time = Time.add(time, increment);
      debug('start:', start, 'increment:', increment, 'result:', time);
      if (log) {
        const ordinal = Format.fixedLength(Format.ordinal(counter), 5);
        Status.log(`${ordinal}: ${start} (next on ${increment})`);
        counter += 1;
      }
    });
    return time;
  }

  /**
   * Set an average time in the timeTable according to the number of slots and
   * the available time. Fill the orignal reminders and return the full time
   * table array
   * @method fillReminder
   * @param  {Number}   quantity  How many alerts should be set
   * @param  {String}   startTime      The start time formated in as hh:mm:ss
   * @param  {String}   endTime   The end time in the format hh:mm:ss
   * @param  {Array}    reminders The reminders array
   * @param  {Boolean} log           If the log with the alerts should be displayed
   * @return {Array} The full filled time table (reminders) array
   */
  static fillReminder(quantity, startTime, endTime, reminders, log) {
    const time = Time.getFinal(startTime, reminders, log);
    const diff = Time.diffFromString(time, endTime);
    const averageTime = diff / quantity;
    const averageTimeString = Time.stringFromMiliseconds(averageTime);
    if (log) {
      const ordinal = Format.fixedLength(Format.ordinal(quantity + 1), 5);
      Time.getFinal(time, new Array(quantity).fill(averageTimeString), log);
      Status.log(`${ordinal}: ${endTime} (last one)`);
    }
    debug('start:', time, 'end:', endTime, 'diff:', averageTimeString);
    const filled = new Array(quantity).fill(averageTimeString);
    return reminders.concat(filled);
  }
}

module.exports = Time;
