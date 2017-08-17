const debug = require('debug')('Time');

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
    return Time.toString(this.startTime);
  }

  /**
   * Convert a date to formated string time
   * @method toString
   * @param  {Number|Object}              date Miliseconds time number or Date object
   * @return {String} The time formated as hh:mm:ss
   */
  static toString(date) {
    debug(date);
    let hours;
    let minutes;
    let seconds;
    if (typeof date === 'object') {
      hours = date.getHours();
      minutes = date.getMinutes();
      seconds = date.getSeconds();
    } else if (typeof date === 'number') {
      let miliseconds = date;

      hours = Math.floor(miliseconds / 1000 / 60 / 60);
      miliseconds -= hours * 1000 * 60 * 60;
      minutes = Math.floor(miliseconds / 1000 / 60);
      miliseconds -= minutes * 1000 * 60;
      seconds = Math.floor(miliseconds / 1000);
    }

    return `${addLeadingZero(hours)}:${addLeadingZero(minutes)}:${addLeadingZero(seconds)}`;
  }

  /**
   * Calculates the interval from two time strings
   * @method interval
   * @param  {String}       start The start time in the format hh:mm:ss
   * @param  {String}       end   The end time in the format hh:mm:ss
   * @return {Number}       Miliseconds interval
   */
  static interval(start, end) {
    const splitStr = start.split(':');
    const splitEnd = end.split(':');
    const strTime = new Date(0, 0, 0, splitStr[0], splitStr[1], splitStr[2]);
    const endTime = new Date(0, 0, 0, splitEnd[0], splitEnd[1], splitEnd[2]);
    return endTime.getTime() - strTime.getTime();
  }

  static stringToCron(time) {
    const spl = time.split(':');
    return `${spl[2]} ${spl[1]} ${spl[0]} * * *`;
  }

  static cronToString(time) {
    const spl = time.split(' ');
    return `${spl[2]}:${spl[1]}:${spl[0]}`;
  }
  /**
   * Summ the time from two time strings
   * @method add
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
  static getFinal(startTime, incrementArray) {
    let time = startTime;
    incrementArray.forEach((increment) => {
      time = Time.add(time, increment);
    });
    return time;
  }

  /**
   * Set an average time in the timeTable according to the number of slots and
   * the available time. Fill the orignal reminders and return the full time
   * table array
   * @method fillReminder
   * @param  {Number}   remindersToFill  How many alerts should be set
   * @param  {String}   startTime      The start time formated in as hh:mm:ss
   * @param  {String}   endTime   The end time in the format hh:mm:ss
   * @param  {Array}    reminders The reminders array
   * @param  {Boolean} log           If the log with the alerts should be displayed
   * @return {Array} The full filled time table (reminders) array
   */
  static fillReminders(remindersToFill, startTime, endTime, reminders) {
    const time = Time.getFinal(startTime, reminders);
    const diff = Time.interval(time, endTime);
    const averageTime = diff / remindersToFill;
    const averageTimeString = Time.toString(averageTime);
    debug('remindersToFill:  ', remindersToFill);
    debug('startTime:        ', startTime);
    debug('endTime:          ', endTime);
    debug('time:             ', time);
    debug('diff:             ', diff);
    debug('averageTime:      ', averageTime);
    debug('averageTimeString:', averageTimeString);
    debug('reminders:        ', reminders);

    const filled = new Array(remindersToFill).fill(averageTimeString);
    return reminders.concat(filled);
  }
}

module.exports = Time;
