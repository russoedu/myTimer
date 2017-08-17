// const debug = require('debug')('Alert');
const Computer = require('./Computer');
const Phone = require('./Phone');
const Terminal = require('./Terminal');
const Time = require('../helpers/Time');

/**
 * Class for displaying alerts
 * @class Alert
 * @module Alert
 */
class Alert {
  /**
   * Display alerts
   * @method display
   * @param  {Object} timer          Timer object
   * @param  {Number} displayCounter The display counter used on the alerts
   */
  static display(timer, displayCounter) {
    let terminal = true;
    let computer = false;
    let phone = false;

    if (timer.media) {
      terminal = timer.media.terminal === undefined ? true : timer.media.terminal;
      computer = timer.media.computer === undefined ? false : timer.media.computer;
      phone = timer.media.phone === undefined ? false : timer.media.phone;
    }

    // Terminal is default
    if (terminal) {
      const time = Time.toString(new Date());
      const statusMessage = ` ${time} >>> ${timer.message} >>> $${displayCounter}$ ${timer.name} `;
      Terminal.log(statusMessage, timer.bgColor);
    }

    if (computer) {
      const computerMessage = `${timer.message}\n$${displayCounter}$ ${timer.name}`;
      Computer.display(timer.title, computerMessage);
    }

    if (phone) {
      const phoneMessage = `${timer.message}\n$${displayCounter}$ ${timer.name}`;
      Phone.display(phoneMessage, timer.token);
    }
  }
}

module.exports = Alert;
