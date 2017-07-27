const debug = require('debug')('Time');

let instance = null;

function addLeadingZero(time) {
  return time < 10 ? `0${time}` : time;
}

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

  getStart() {
    const hours = this.startTime.getHours();
    const minutes = this.startTime.getMinutes();
    const seconds = this.startTime.getSeconds();

    return `${addLeadingZero(hours)}:${addLeadingZero(minutes)}:${addLeadingZero(seconds)}`;
  }

  static start() {
    /* eslint-disable no-new */
    new Time();
  }

  static milisecondsFromString(time) {
    const parts = time.split(":");
    if (parts.length === 1) {
      return (parts[0] * 1000);
    }
    if (parts.length === 2) {
      return ((parts[0] * 1000 * 60) + (parts[1] * 1000));
    }
    return ((parts[0] * 1000 * 60 * 60) + (parts[1] * 1000 * 60) + (parts[2] * 1000));
  }

  static stringFromMiliseconds(time) {
    let mili = time;

    const hours = Math.floor(mili / 1000 / 60 / 60);
    mili -= hours * 1000 * 60 * 60;
    const minutes = Math.floor(mili / 1000 / 60);
    mili -= minutes * 1000 * 60;
    const seconds = Math.floor(mili / 1000);

    return `${addLeadingZero(hours)}:${addLeadingZero(minutes)}:${addLeadingZero(seconds)}`;
  }

  static diffFromString(start, end) {
    const splitStr = start.split(':');
    const splitEnd = end.split(':');
    const strTime = new Date(0, 0, 0, splitStr[0], splitStr[1], splitStr[2]);
    const endTime = new Date(0, 0, 0, splitEnd[0], splitEnd[1], splitEnd[2]);
    return endTime.getTime() - strTime.getTime();
  }

  static add(start, increment) {
    const times = [];
    const splitStr = start.split(':');
    const splitIncrm = increment.split(':');

    for (let i = 0; i < 3; i++) {
      splitStr[i] = (isNaN(parseInt(splitStr[i], 10))) ? 0 : parseInt(splitStr[i], 10);
      splitIncrm[i] = (isNaN(parseInt(splitIncrm[i], 10))) ? 0 : parseInt(splitIncrm[i], 10);
      times[i] = splitStr[i] + splitIncrm[i];
    }

    let hours = times[0];
    let minutes = times[1];
    let seconds = times[2];


    if (seconds > 60) {
      minutes += parseInt(seconds / 60, 10);
      seconds %= 60;
    }

    if (minutes > 60) {
      hours += parseInt(minutes / 60, 10);
      minutes %= 60;
    }

    return `${addLeadingZero(hours)}:${addLeadingZero(minutes)}:${addLeadingZero(seconds)}`;
  }

  static getFinal(startTime, incrementArray) {
    let time = startTime;
    incrementArray.forEach((increment) => {
      const start = time;
      time = Time.add(time, increment);
      debug('start:', start, 'increment:', increment, 'result:', time);
    });
    return time;
  }

  static distribute(quantity, startTime, endTime, reminders) {
    const time = Time.getFinal(startTime, reminders);
    // reminders.forEach((reminder, key) => {
    //   time = Time.addTimes(time, reminder);
    // })
    const diff = Time.diffFromString(time, endTime);
    const averageTime = diff / quantity;
    debug('start:', time, 'end:', endTime, 'diff:', diff);
    const averageTimeString = Time.stringFromMiliseconds(averageTime);
    return new Array(quantity).fill(averageTimeString);
  }
}

module.exports = Time;
