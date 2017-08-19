const expect = require('chai').expect;
const Format = require('../src/helpers/Format');

describe('Format', () => {
  describe('ordinal(num)', () => {
    it('should create ordinal value for numbers finished in 0', () => {
      const zeroth = Format.ordinal(0);
      const tenth = Format.ordinal(10);
      const twentieth = Format.ordinal(20);
      const oneMillionth = Format.ordinal(100000);
      expect('0th').to.equal(zeroth);
      expect('10th').to.equal(tenth);
      expect('20th').to.equal(twentieth);
      expect('100000th').to.equal(oneMillionth);
    });
    it('should create ordinal value for numbers finished in 1', () => {
      const first = Format.ordinal(1);
      const eleventh = Format.ordinal(11);
      const twentyFirst = Format.ordinal(21);
      expect('1st').to.equal(first);
      expect('11st').to.not.equal(eleventh);
      expect('11th').to.equal(eleventh);
      expect('21st').to.equal(twentyFirst);
    });
    it('should create ordinal value for numbers finished in 2', () => {
      const second = Format.ordinal(2);
      const twelfth = Format.ordinal(12);
      const twentySecond = Format.ordinal(22);
      expect('2nd').to.equal(second);
      expect('12nd').to.not.equal(twelfth);
      expect('12th').to.equal(twelfth);
      expect('22nd').to.equal(twentySecond);
    });
    it('should create ordinal value for numbers finished in 3', () => {
      const third = Format.ordinal(3);
      const thirteenth = Format.ordinal(13);
      const twentyThird = Format.ordinal(23);
      expect('3rd').to.equal(third);
      expect('13rd').to.not.equal(thirteenth);
      expect('13th').to.equal(thirteenth);
      expect('23rd').to.equal(twentyThird);
    });
    it('should create ordinal value for numbers finished in 4+', () => {
      const fourth = Format.ordinal(4);
      const sixteenth = Format.ordinal(16);
      const twentyEighth = Format.ordinal(28);
      const sixtieth = Format.ordinal(60);

      expect('4th').to.equal(fourth);
      expect('16th').to.equal(sixteenth);
      expect('28th').to.equal(twentyEighth);
      expect('60th').to.equal(sixtieth);
    });
  });
  describe('fixedLength(str, length)', () => {
    it('should return a string', () => {
      const num = 15;
      const length = 5;
      const str = Format.fixedLength(num, length);

      expect(str).to.be.a('string');
    });
    it('should return a string with spaces in the begining and then the string', () => {
      const num = 15;
      const length = 15;
      const str = Format.fixedLength(num, length);

      for (let i = 0; i < 13; i += 1) {
        expect(str[i]).to.equal(' ');
      }

      expect(str[13]).to.equal('1');
      expect(str[14]).to.equal('5');
    });
    it('should return a string with the correct length', () => {
      const num = 'hi';
      const length = 10;
      const str = Format.fixedLength(num, length);

      expect(str).to.have.lengthOf(10);
    });
  });
});
