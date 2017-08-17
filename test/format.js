const assert = require('chai').assert;
const Format = require('../src/helpers/Format');

describe('Format', () => {
  describe('ordinal(num)', () => {
    it('should create ordinal value for numbers finished in 0', () => {
      const zeroth = Format.ordinal(0);
      const tenth = Format.ordinal(10);
      const twentieth = Format.ordinal(20);
      const oneMillionth = Format.ordinal(100000);
      assert.equal('0th', zeroth);
      assert.equal('10th', tenth);
      assert.equal('20th', twentieth);
      assert.equal('100000th', oneMillionth);
    });
    it('should create ordinal value for numbers finished in 1', () => {
      const first = Format.ordinal(1);
      const eleventh = Format.ordinal(11);
      const twentyFirst = Format.ordinal(21);
      assert.equal('1st', first);
      assert.notEqual('11st', eleventh);
      assert.equal('11th', eleventh);
      assert.equal('21st', twentyFirst);
    });
    it('should create ordinal value for numbers finished in 2', () => {
      const second = Format.ordinal(2);
      const twelfth = Format.ordinal(12);
      const twentySecond = Format.ordinal(22);
      assert.equal('2nd', second);
      assert.notEqual('12nd', twelfth);
      assert.equal('12th', twelfth);
      assert.equal('22nd', twentySecond);
    });
    it('should create ordinal value for numbers finished in 3', () => {
      const third = Format.ordinal(3);
      const thirteenth = Format.ordinal(13);
      const twentyThird = Format.ordinal(23);
      assert.equal('3rd', third);
      assert.notEqual('13rd', thirteenth);
      assert.equal('13th', thirteenth);
      assert.equal('23rd', twentyThird);
    });
    it('should create ordinal value for numbers finished in 4+', () => {
      const fourth = Format.ordinal(4);
      const sixteenth = Format.ordinal(16);
      const twentyEighth = Format.ordinal(28);
      const sixtieth = Format.ordinal(60);

      assert.equal('4th', fourth);
      assert.equal('16th', sixteenth);
      assert.equal('28th', twentyEighth);
      assert.equal('60th', sixtieth);
    });
  });
});
