const assert = require('chai').assert;
const sinon = require('sinon');
const Time = require('../src/helpers/Time');

let clock;
const timeRegExp = /[0-9]{2}:[0-9]{2}:[0-9]{2}/;
const cronRegExp = /[0-9*]+ [0-9*]+ [0-9*]+ [0-9*]+ [0-9*]+ [0-9*]+/;

function createMilisecondsNumber(h, m, s) {
  const seconds = 1000;
  const minutes = 1000 * 60;
  const hours = 1000 * 60 * 60;
  return (h * hours) + (m * minutes) + (s * seconds);
}

describe('Time', () => {
  beforeEach(() => {
    clock = sinon.useFakeTimers();
  });
  afterEach(() => {
    clock.restore();
  });

  describe('constructor()', () => {
    it('should return object', () => {
      const time1 = new Time();
      clock.tick(2 * 60 * 60 * 1000);
      const time2 = new Time();

      assert.isObject(time1);
      assert.isObject(time2);
    });
    it('should return singleton object with the same startTime', () => {
      const time1 = new Time();
      const date1 = new Date();
      clock.tick(2 * 60 * 60 * 1000);
      const time2 = new Time();
      const date2 = new Date();

      assert.isObject(time1);
      assert.isObject(time2);
      assert.equal(time1.startTime, time2.startTime);
      assert.notEqual(Time.toString(date1), Time.toString(date2));
    });
  });

  describe('getStart()', () => {
    it('should return same string for all instances (singleton)', () => {
      const time1 = new Time();
      clock.tick(2 * 60 * 60 * 1000);
      const time2 = new Time();

      assert.isString(time1.getStart());
      assert.isString(time2.getStart());
      assert.equal(time1.getStart(), time2.getStart());
    });
    it('should return time formated string', () => {
      const time = new Time();
      assert.match(time.getStart(), timeRegExp);
    });
  });

  describe('toString(date)', () => {
    it('should identify the type of attribute', () => {
      clock.tick(2 * 60 * 60 * 1000);
      const date = new Date();
      const miliseconds = createMilisecondsNumber(4, 16, 24);
      assert.match(Time.toString(date), timeRegExp);
      assert.match(Time.toString(miliseconds), timeRegExp);
    });
    it('should convert Date object to time formated string', () => {
      clock.tick(2 * 60 * 60 * 1000);
      const date = new Date();
      assert.match(Time.toString(date), timeRegExp);
    });
    it('should convert miliseconds to time formated string', () => {
      const time = 9200000;
      assert.match(Time.toString(time), timeRegExp);
    });
    // TODO Fix it using a defined timezone, so the test can be always the same
    // it('should convert Date object to the correct time formated string', () => {
    //   // This is needed to assert it won't relay on the user's time zone
    //   clock.tick(365 * 10 * 3 * 60 * 60 * 1000);
    //   function createDateAsUTC(date) {
    //     // This is needed to assert it won't relay on the user's time zone
    //     return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(),
    //       date.getHours(), date.getMinutes(), date.getSeconds()));
    //   }
    //
    //   const date1 = createDateAsUTC(new Date());
    //   clock.tick(4 * 60 * 60 * 1000);
    //   const date2 = createDateAsUTC(new Date());
    //
    //   assert.equal('00:00:00', Time.toString(date1));
    //   assert.equal('04:00:00', Time.toString(date2));
    // });
    it('should convert miliseconds to the correct time formated string', () => {
      const time1 = createMilisecondsNumber(0, 0, 0);
      const time2 = createMilisecondsNumber(10, 55, 36);

      assert.equal('00:00:00', Time.toString(time1));
      assert.equal('10:55:36', Time.toString(time2));
    });
  });

  describe('interval(start, end)', () => {
    it('should return the difference in miliseconds', () => {
      const time1 = '01:24:00';
      const time2 = '03:14:16';
      const interval = createMilisecondsNumber(1, 50, 16);
      assert.equal(interval, Time.interval(time1, time2));
    });
  });

  describe('stringToCron(time)', () => {
    it('should return in cron format', () => {
      const time = '03:12:34';
      assert.match(Time.stringToCron(time), cronRegExp);
    });
    it('should return the correct cron', () => {
      const time = '03:12:34';
      assert.equal('34 12 03 * * *', Time.stringToCron(time));
    });
  });

  describe('cronToString(time)', () => {
    it('should return in time format', () => {
      const time = '34 12 03 * * *';
      assert.match(Time.cronToString(time), timeRegExp);
    });
    it('should return the correct cron', () => {
      const time = '34 12 03 * * *';
      assert.equal('03:12:34', Time.cronToString(time));
    });
  });

  describe('add(start, increment)', () => {
    it('should return in time format', () => {
      const start = '01:00:30';
      const increment = '03:14:50';
      assert.match(Time.add(start, increment), timeRegExp);
    });
    it('should return the correct increment', () => {
      const start = '01:06:30';
      const increment = '03:14:50';
      assert.equal('04:21:20', Time.add(start, increment));
    });
  });

  describe('getFinal(startTime, incrementArray)', () => {
    it('should return in time format', () => {
      const startTime = '01:00:30';
      const incrementArray = ['03:14:50', '01:00:00'];
      assert.match(Time.getFinal(startTime, incrementArray), timeRegExp);
    });
    it('should return the correct increment', () => {
      const startTime = '01:06:30';
      const incrementArray = ['03:14:50', '01:00:00'];
      assert.equal('05:21:20', Time.getFinal(startTime, incrementArray));
    });
  });

  describe('fillReminders(remindersToFill, startTime, endTime, reminders)', () => {
    it('should return an array', () => {
      const remindersToFill = 11;
      const startTime = '10:00:00';
      const endTime = '12:00:00';
      const reminders = ['00:10:00'];
      const filled = Time.fillReminders(remindersToFill, startTime, endTime, reminders);
      assert.isArray(filled);
    });
    it('should return the correct distribution', () => {
      const remindersToFill = 11;
      const startTime = '10:00:00';
      const endTime = '12:00:00';
      const reminders = ['00:10:00'];
      const filled = Time.fillReminders(remindersToFill, startTime, endTime, reminders);
      filled.forEach((time) => {
        assert.equal('00:10:00', time);
      });
    });
  });
});
