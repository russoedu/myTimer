/* eslint-disable no-console */
const assert = require('chai').assert;
const Time = require('../src/helpers/Time');
const Alert = require('../src/views/Alert');
const Terminal = require('../src/views/Terminal');
const Computer = require('../src/views/Computer');
const Phone = require('../src/views/Phone');

let terminalLog;
let response = {};
let computerDisplay;
let phoneDisplay;

const timer = {
  name: 'name',
  title: 'title',
  message: 'message',
  bgColor: 'color',
  token: 'token',
  media: {
    terminal: false,
    computer: false,
    phone: false,
  },
};
describe('Alert', () => {
  // Clean the data
  beforeEach(() => {
    response = {};
    timer.media = {
      terminal: false,
      computer: false,
      phone: false,
    };
  });

  before(() => {
    // Save the views functions
    terminalLog = Terminal.log;
    computerDisplay = Computer.display;
    phoneDisplay = Phone.display;

    // Replace the views functions for tests
    Terminal.log = (msg, color) => {
      response.terminal = {
        msg,
        color,
      };
    };
    Computer.display = (title, message) => {
      response.computer = {
        title,
        message,
      };
    };
    Phone.display = (message, token) => {
      response.phone = {
        message,
        token,
      };
    };
  });
  after(() => {
    // Return the view functions to it's original versions
    Terminal.log = terminalLog;
    Computer.display = computerDisplay;
    Phone.display = phoneDisplay;
  });

  describe('display(timer, displayCounter)', () => {
    it('should alert on terminal only', () => {
      timer.media.terminal = true;

      Alert.display(timer, 1);

      assert.isObject(response.terminal);
      assert.isUndefined(response.computer);
      assert.isUndefined(response.phone);
    });

    it('should alert on computer only', () => {
      timer.media.computer = true;

      Alert.display(timer, 1);

      assert.isObject(response.computer);
      assert.isUndefined(response.terminal);
      assert.isUndefined(response.phone);
    });

    it('should alert on phone only', () => {
      timer.media.phone = true;

      Alert.display(timer, 1);

      assert.isObject(response.phone);
      assert.isUndefined(response.computer);
      assert.isUndefined(response.terminal);
    });

    it('should format terminal log', () => {
      timer.media.terminal = true;

      Alert.display(timer, '--X--');
      const time = Time.toString(new Date());
      assert.equal(response.terminal.msg, ` ${time} >>> message >>> $--X--$ name `);
      assert.equal(response.terminal.color, 'color');
    });

    it('should format computer log', () => {
      timer.media.computer = true;

      Alert.display(timer, '--X--');
      assert.equal(response.computer.title, 'title');
      assert.equal(response.computer.message, 'message\n$--X--$ name');
    });

    it('should format phone log', () => {
      timer.media.phone = true;

      Alert.display(timer, '--X--');
      assert.equal(response.phone.message, 'message\n$--X--$ name');
      assert.equal(response.phone.token, 'token');
    });

    it('should use terminal as default log', () => {
      delete timer.media;

      Alert.display(timer, '--X--');

      assert.isObject(response.terminal);
      assert.isUndefined(response.computer);
      assert.isUndefined(response.phone);
    });
  });
});
