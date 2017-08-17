const assert = require('chai').assert;
const path = require('path');
const TimerModel = require('../src/models/TimerModel');


describe('TimerModel', () => {
  describe('constructor()', () => {
    it('should merge object with default', (done) => {
      const folder = './timers';
      const filePath = path.join(folder, 'smoke.json');
      new TimerModel(filePath)
        .then((model) => {
          assert.equal(model.fileName, 'smoke');
          assert.equal(model.title, '🚬');
          assert.isObject(model.media);
          assert.isArray(model.reminders);
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
          assert.isUndefined(err, 'Undefined error');
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
          assert.isUndefined(err, 'Undefined error');
          done();
        });
    });
  });
});
