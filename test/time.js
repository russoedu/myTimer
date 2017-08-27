const expect = require('chai').expect;
const sinon = require('sinon');
const Time = require('../src/helpers/Time');

let clock;
const timeRegExp = /[0-9]{2}:[0-9]{2}:[0-9]{2}/;
const cronRegExp = /[0-9*]+ [0-9*]+ [0-9*]+ [0-9*]+ [0-9*]+ [0-9*]+/;
const hours = 60 * 60 * 1000;
const minutes = 60 * 1000;
const seconds = 1000;

function addLeadingZero(time) {
  return time < 10 ? `0${time}` : time;
}

function createMilisecondsNumber(h, m, s) {
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
      clock.tick((2 * hours) + (43 * minutes) + (32 * seconds));
      const time2 = new Time();

      expect(time1).to.be.an('object');
      expect(time2).to.be.an('object');
    });
    it('should return singleton object with the same startTime', () => {
      const time1 = new Time();
      // Set the startTime to 1970-01-01T00:00:00.000Z to avoid the real clock
      time1.startTime = new Date();
      const date1 = new Date();
      clock.tick((2 * hours) + (43 * minutes) + (32 * seconds));
      const time2 = new Time();
      const date2 = new Date();

      expect(time1.getStart()).to.equal(time2.getStart());
      expect(Time.toString(date1)).to.not.equal(Time.toString(date2));
    });
  });

  describe('getStart()', () => {
    it('should return time string', () => {
      const time1 = new Time();

      expect(time1.getStart()).to.be.a('string');
    });
    it('should return correct time', () => {
      const time = new Time();
      // Create a reseted date to check if the conversion works
      const now = new Date();
      const h = now.getHours();
      const m = now.getMinutes();
      const s = now.getSeconds();
      const str = `${addLeadingZero(h)}:${addLeadingZero(m)}:${addLeadingZero(s)}`;

      expect(time.getStart()).to.equal(str);
    });
    it('should return time formated string', () => {
      const time = new Time();
      expect(time.getStart()).to.match(timeRegExp);
    });
  });

  describe('toString(date)', () => {
    it('should identify the type of attribute', () => {
      clock.tick(2 * 60 * 60 * 1000);
      const date = new Date();
      const miliseconds = createMilisecondsNumber(4, 16, 24);
      expect(Time.toString(date)).to.match(timeRegExp);
      expect(Time.toString(miliseconds)).to.match(timeRegExp);
    });
    it('should return error if attribute is not Date or number', () => {
      const shouldBeError = 'test';
      expect(Time.toString(shouldBeError)).to.be.an('error');
    });
    it('should convert Date object to time formated string', () => {
      clock.tick(2 * 60 * 60 * 1000);
      const date = new Date();
      expect(Time.toString(date)).to.match(timeRegExp);
    });
    it('should convert miliseconds to time formated string', () => {
      const time = 9200000;
      expect(Time.toString(time)).to.match(timeRegExp);
    });
    // TODO Fix it using a defined timezone, so the test can be always the same
    it('should convert Date object to the correct time formated string', () => {
      // This is needed to assert it won't relay on the user's time zone
      clock.tick(365 * 10 * 3 * 60 * 60 * 1000);
      function createDateAsUTC(date) {
        // This is needed to assert it won't relay on the user's time zone
        return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(),
          date.getHours(), date.getMinutes(), date.getSeconds()));
      }

      const date1 = createDateAsUTC(new Date());
      clock.tick(4 * 60 * 60 * 1000);
      const date2 = createDateAsUTC(new Date());

      expect(Time.toString(date1)).to.equal('00:00:00');
      expect(Time.toString(date2)).to.equal('04:00:00');
    });
    it('should convert miliseconds to the correct time formated string', () => {
      const time1 = createMilisecondsNumber(0, 0, 0);
      const time2 = createMilisecondsNumber(10, 55, 36);

      expect('00:00:00').to.equal(Time.toString(time1));
      expect('10:55:36').to.equal(Time.toString(time2));
    });
  });

  describe('interval(start, end)', () => {
    it('should return the difference in miliseconds', () => {
      const time1 = '01:24:00';
      const time2 = '03:14:16';
      const interval = createMilisecondsNumber(1, 50, 16);
      expect(interval).to.equal(Time.interval(time1, time2));
    });
  });

  describe('stringToCron(time)', () => {
    it('should return in cron format', () => {
      const time = '03:12:34';
      expect(Time.stringToCron(time)).to.match(cronRegExp);
    });
    it('should return the correct cron', () => {
      const time = '03:12:34';
      expect('34 12 03 * * *').to.equal(Time.stringToCron(time));
    });
  });

  describe('cronToString(time)', () => {
    it('should return in time format', () => {
      const time = '34 12 03 * * *';
      expect(Time.cronToString(time)).to.match(timeRegExp);
    });
    it('should return the correct cron', () => {
      const time = '34 12 03 * * *';
      expect('03:12:34').to.equal(Time.cronToString(time));
    });
  });

  describe('add(start, increment)', () => {
    it('should return in time format', () => {
      const start = '01:00:30';
      const increment = '03:14:50';
      expect(Time.add(start, increment)).to.match(timeRegExp);
    });
    it('should return the correct increment', () => {
      const start = '01:06:30';
      const increment = '03:14:50';
      expect('04:21:20').to.equal(Time.add(start, increment));
    });
    it('should sum with zero times increment', () => {
      const start = '01:25:32';
      const increment = '00:00:00';
      expect('01:25:32').to.equal(Time.add(start, increment));
    });
    it('should sum zero with non formated time', () => {
      const start = '01:25:32';
      const increment = 'xx:xx:xx';
      expect('01:25:32').to.equal(Time.add(start, increment));
    });
    it('should start as zero with non formated time', () => {
      const start = 'xx:xx:xx';
      const increment = '01:25:32';
      expect('01:25:32').to.equal(Time.add(start, increment));
    });
  });

  describe('getFinal(startTime, incrementArray)', () => {
    it('should return in time format', () => {
      const startTime = '01:00:30';
      const incrementArray = ['03:14:50', '01:00:00'];
      expect(Time.getFinal(startTime, incrementArray)).to.match(timeRegExp);
    });
    it('should return the correct increment', () => {
      const startTime = '01:06:30';
      const incrementArray = ['03:14:50', '01:00:00'];
      expect('05:21:20').to.equal(Time.getFinal(startTime, incrementArray));
    });
  });

  describe('fillReminders(remindersToFill, startTime, endTime, reminders)', () => {
    it('should return an array', () => {
      const remindersToFill = 11;
      const startTime = '10:00:00';
      const endTime = '12:00:00';
      const reminders = ['00:10:00'];
      const filled = Time.fillReminders(remindersToFill, startTime, endTime, reminders);
      expect(filled).to.be.an('array');
    });
    it('should return the correct distribution', () => {
      const remindersToFill = 11;
      const startTime = '10:00:00';
      const endTime = '12:00:00';
      const reminders = ['00:10:00'];
      const filled = Time.fillReminders(remindersToFill, startTime, endTime, reminders);
      filled.forEach((time) => {
        expect('00:10:00').to.equal(time);
      });
    });
  });
});
