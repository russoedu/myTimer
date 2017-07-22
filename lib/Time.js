const debug = require('debug')('Time');

let instance = null;

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
    let hours = this.startTime.getHours();
    let minutes = this.startTime.getMinutes();
    let seconds = this.startTime.getSeconds();
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    return `${hours}:${minutes}:${seconds}`;
  }

  static start() {
    new Time();
  }

  static milisecondsFromString(time) {
    const parts = time.split(":");
    if (parts.length === 1) {
      return (parts[0] * 1000);
    }
    if (parts.length === 2) {
      return (parts[0] * 1000 * 60 + parts[1] * 1000);
    }
    return (parts[0] * 1000 * 60 * 60 + parts[1] * 1000 * 60 + parts[2] * 1000);
  }

  static stringFromMiliseconds(time) {
    let mili = time;

    let hours = Math.floor(mili / 1000 / 60 / 60);
    mili -= hours * 1000 * 60 * 60;
    let minutes = Math.floor(mili / 1000 / 60);
    mili -= minutes * 1000 * 60;
    let seconds = Math.floor(mili / 1000);

    return (hours <= 9 ? "0" : "") + hours + ":" + (minutes <= 9 ? "0" : "") + minutes + ':' + (seconds <= 9 ? "0" : "") + seconds;
  }

  static diffFromString(start, end) {
    const splitStr = start.split(":");
    const splitEnd = end.split(":");
    const strTime = new Date(0, 0, 0, splitStr[0], splitStr[1], splitStr[2]);
    const endTime = new Date(0, 0, 0, splitEnd[0], splitEnd[1], splitEnd[2]);
    return endTime.getTime() - strTime.getTime();
  }

  static add(start, increment) {
    let times = [];
    let splitStr = start.split(':');
    let splitIncrm = increment.split(':');

    for (let i = 0; i < 3; i++) {
      splitStr[i] = (isNaN(parseInt(splitStr[i]))) ? 0 : parseInt(splitStr[i])
      splitIncrm[i] = (isNaN(parseInt(splitIncrm[i]))) ? 0 : parseInt(splitIncrm[i])
      times[i] = splitStr[i] + splitIncrm[i];
    }

    let hours = times[0];
    let minutes = times[1];
    let seconds = times[2];


    if (seconds > 60) {
      minutes += parseInt(seconds / 60);
      seconds %= 60;
    }

    if (minutes > 60) {
      hours += parseInt(minutes / 60);
      minutes %= 60;
    }

    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    return hours + ':' + minutes + ':' + seconds;
  }

  static getFinal(startTime, incrementArray) {
    let time = startTime;
    incrementArray.forEach((increment, key) => {
      const start = time;
      time = Time.add(time, increment);
      debug('start:', start, 'increment:', increment, 'result:', time);
    });
    return time;
  }

  static distribute(quantity, startTime, endTime, reminders) {
    let time = Time.getFinal(startTime, reminders);
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
