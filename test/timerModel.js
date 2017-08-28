const expect = require('chai').expect;
const path = require('path');
const sinon = require('sinon');
const TimerModel = require('../src/models/TimerModel');
const Time = require('../src/helpers/Time');
const Terminal = require('../src/views/Terminal');

let clock;
const folder = './test/timers';

describe('TimerModel', () => {
  beforeEach(() => {
    clock = sinon.useFakeTimers();
    // Reset the start time for all tests to 1970-01-01T00:00:00.000Z
    const time = new Time();
    time.startTime = new Date();
  });
  afterEach(() => {
    clock.restore();
  });
  describe('constructor()', () => {
    it('should merge object with default', (done) => {
      const filePath = path.join(folder, 'smoke.json');
      new TimerModel(filePath)
        .then((model) => {
          expect(model.fileName).to.equal('smoke');
          expect(model.title).to.equal('🚬 DEBUG');
          expect(model.media).to.be.an('object');
          expect(model.reminders).to.be.an('array');
          done();
        })
        .catch((err) => {
          done(err || new Error('Model not created'));
        });
    });
    it('should create reminders', (done) => {
      const filePath = path.join(folder, 'noReminders.json');
      new TimerModel(filePath)
        .then((model) => {
          expect(model.fileName).to.equal('noReminders');
          expect(model.reminders).to.be.an('array');
          done();
        })
        .catch((err) => {
          done(err || new Error('Model not created'));
        });
    });
    it('should set the first reminder for 1 second', (done) => {
      const filePath = path.join(folder, 'smoke.json');
      const time = new Time();
      new TimerModel(filePath)
        .then((model) => {
          expect(model.fileName).to.equal('smoke');
          const startTime = time.getStart();
          const splitStart = startTime.split(':');
          const cronTime = `01 00 ${splitStart[0]} * * *`;
          expect(model.reminders[0]).to.equal(cronTime);
          done();
        })
        .catch((err) => {
          done(err || new Error('Model not created'));
        });
    });
    it('should ignore default.json', (done) => {
      const filePath = path.join(folder, 'default.json');
      new TimerModel(filePath)
        .then(() => {
          done(new Error('Model should not be created'));
        })
        .catch((err) => {
          expect(err).to.be.undefined;
          done();
        });
    });
    it('should ignore non .json files', (done) => {
      const filePath = path.join(folder, 'ignore.txt');
      new TimerModel(filePath)
        .then(() => {
          done(new Error('Model should not be created'));
        })
        .catch((err) => {
          expect(err).to.be.undefined;
          done();
        });
    });
    it('should log error', (done) => {
      const filePath = path.join(folder, 'empty.json');
      const message = {};
      const terminalError = Terminal.error;
      Terminal.error = (err) => {
        message.err = err;
      };
      new TimerModel(filePath)
        .then(() => {
          expect(message.err).to.equal('ERROR: Error on empty configuration. Please be sure that "quantity" is smaller or equal the length of "reminders".');
          Terminal.error = terminalError;
          done();
        })
        .catch((err) => {
          done(err || new Error('Model not created'));
        });
    });
    it('should throw error on unexisting files', (done) => {
      const filePath = path.join(folder, 'noFile.json');
      new TimerModel(filePath)
        .then(() => {
          done();
        })
        .catch((err) => {
          expect(err).to.be.an('error');
          expect(err.code).to.equal('ENOENT');
          done();
        });
    });
  });
});
