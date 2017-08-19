// const expect = require('chai').expect;
const Computer = require('../src/views/Computer');
const sinon = require('sinon');
const notifier = require('node-notifier');

const title = 'title';
const message = 'message';
let notify;

describe('Computer', () => {
  before(() => {
    notify = sinon.stub(notifier, 'notify');
  });
  after(() => {
    notifier.notify.restore();
  });

  describe('display(title, message)', () => {
    it('should call notifier.notify', () => {
      Computer.display(title, message);

      sinon.assert.calledOnce(notify);
    });
    it('should fill the notifier object correctly', () => {
      Computer.display(title, message);
      const expectedMessage = {
        group: title,
        sound: true,
        message,
        title,
      };

      sinon.assert.calledWith(notify, expectedMessage);
    });
    it('should replace the ordinal on the message', () => {
      Computer.display(title, '$3$ message');

      const expectedMessage = {
        group: title,
        sound: true,
        message: '3rd message',
        title,
      };

      sinon.assert.calledWith(notify, expectedMessage);
    });
  });
});
