// const expect = require('chai').expect;
const Terminal = require('../src/views/Terminal');
const sinon = require('sinon');
const chalk = require('chalk');

const message = 'message';
const color = 'bgRed';
const length = 5;

let write;
// let chlk;

describe('Terminal', () => {
  before(() => {
    write = sinon.stub(process.stdout, 'write');
  });

  after(() => {
    process.stdout.write.restore();
  });

  describe('display(message, color, length)', () => {
    it('should fill the process.stdout.write object correctly', () => {
      Terminal.display(message, color, length);
      const expectedObj = `${chalk[color](message)}\n`;

      sinon.assert.calledWith(write, expectedObj);
    });
    it('should replace the ordinal on the message', () => {
      Terminal.display('$3$ message', color, length);
      const expectedObj = `${chalk[color]('  3rd message')}\n`;

      sinon.assert.calledWith(write, expectedObj);
    });
  });
  describe('error(obj)', () => {
    it('should fill the process.stdout.write object correctly', () => {
      Terminal.error(message);
      const expectedObj = `${chalk.bgRed(message)}\n`;

      sinon.assert.calledWith(write, expectedObj);
    });
  });
});
