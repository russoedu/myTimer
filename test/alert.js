const expect = require('chai').expect;
const Time = require('../src/helpers/Time');
const Alert = require('../src/views/Alert');
const Terminal = require('../src/views/Terminal');
const Computer = require('../src/views/Computer');
const Phone = require('../src/views/Phone');

let response = {};
let terminalDisplay;
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
    // Reset the start time for all tests to 1970-01-01T00:00:00.000Z
    const time = new Time();
    time.startTime = new Date();

    // Save the views functions
    terminalDisplay = Terminal.display;
    computerDisplay = Computer.display;
    phoneDisplay = Phone.display;

    // Replace the views functions for tests
    Terminal.display = (msg, color) => {
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
    Terminal.display = terminalDisplay;
    Computer.display = computerDisplay;
    Phone.display = phoneDisplay;
  });

  describe('display(timer, displayCounter)', () => {
    it('should alert on terminal only', () => {
      timer.media.terminal = true;

      Alert.display(timer, 1);

      expect(response.terminal).to.be.an('object');
      expect(response.computer).to.be.undefined;
      expect(response.phone).to.be.undefined;
    });

    it('should alert on computer only', () => {
      timer.media.computer = true;

      Alert.display(timer, 1);

      expect(response.computer).to.be.an('object');
      expect(response.terminal).to.be.undefined;
      expect(response.phone).to.be.undefined;
    });

    it('should alert on phone only', () => {
      timer.media.phone = true;

      Alert.display(timer, 1);

      expect(response.phone).to.be.an('object');
      expect(response.computer).to.be.undefined;
      expect(response.terminal).to.be.undefined;
    });

    it('should format terminal log', () => {
      timer.media.terminal = true;

      Alert.display(timer, '--X--');
      const time = Time.toString(new Date());
      expect(response.terminal.msg).to.equal(` ${time} >>> message >>> $--X--$ name `);
      expect(response.terminal.color).to.equal('color');
    });

    it('should format computer log', () => {
      timer.media.computer = true;

      Alert.display(timer, '--X--');
      expect(response.computer.title).to.equal('title');
      expect(response.computer.message).to.equal('message\n$--X--$ name');
    });

    it('should format phone log', () => {
      timer.media.phone = true;

      Alert.display(timer, '--X--');
      expect(response.phone.message).to.equal('message\n$--X--$ name');
      expect(response.phone.token).to.equal('token');
    });

    it('should use terminal as default log', () => {
      delete timer.media;

      Alert.display(timer, '--X--');

      expect(response.terminal).to.be.an('object');
      expect(response.computer).to.be.undefined;
      expect(response.phone).to.be.undefined;
    });
  });
});
