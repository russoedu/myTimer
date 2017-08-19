const expect = require('chai').expect;
const path = require('path');
const DefaultTimerModel = require('../src/models/DefaultTimerModel');
const TimerModel = require('../src/models/TimerModel');

describe('DefaultTimerModel', () => {
  describe('constructor()', () => {
    it('should return singleton to avoid loading file more than once', () => {
      const default1 = new DefaultTimerModel();
      const default2 = new DefaultTimerModel();
      expect(default1.startTime).to.equal(default2.startTime);
    });
  });
  describe('merge(timer)', () => {
    it('should merge object with default', (done) => {
      const folder = './timers';
      const filePath = path.join(folder, 'smoke.json');
      new TimerModel(filePath)
        .then((model) => {
          expect(model.title).to.not.equal('🍰');
          expect(model.message).to.not.equal('The cake is a lie');
          done();
        })
        .catch((err) => {
          done(err || new Error('Model not created'));
        });
    });
  });
});
