const expect = require('chai').expect;
const path = require('path');
const TimerModel = require('../src/models/TimerModel');

describe('TimerModel', () => {
  describe('constructor()', () => {
    it('should merge object with default', (done) => {
      const folder = './timers';
      const filePath = path.join(folder, 'smoke.json');
      new TimerModel(filePath)
        .then((model) => {
          expect(model.fileName).to.equal('smoke');
          expect(model.title).to.equal('🚬');
          expect(model.media).to.be.an('object');
          expect(model.reminders).to.be.an('array');
          done();
        })
        .catch((err) => {
          done(err || new Error('Model not created'));
        });
    });
    it('should ignore default.json', (done) => {
      const folder = './timers';
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
      const folder = './timers';
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
  });
});
