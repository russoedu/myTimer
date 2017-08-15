// /* eslint no-undef: 0 */
const assert = require('chai').assert;
const path = require('path');
const DefaultTimerModel = require('../src/models/DefaultTimerModel');
const TimerModel = require('../src/models/TimerModel');

describe('DefaultTimerModel', () => {
  describe('constructor()', () => {
    it('should return singleton to avoid loading file more than once', () => {
      const default1 = new DefaultTimerModel();
      const default2 = new DefaultTimerModel();
      assert.equal(default1.startTime, default2.startTime);
    });
  });
  describe('merge(timer)', () => {
    it('should merge object with default', (done) => {
      const folder = './timers';
      const filePath = path.join(folder, 'smoke.json');
      new TimerModel(filePath)
        .then((model) => {
          assert.notEqual(model.title, 'Remember');
          assert.notEqual(model.message, '🍰 The cake is a lie');
          done();
        })
        .catch((err) => {
          done(err || new Error('Model not created'));
        });
    });
  });
});
