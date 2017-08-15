// const debug = require('debug')('Alert');
const Computer = require('./Computer');
const Phone = require('./Phone');
const Terminal = require('./Terminal');
const Format = require('../helpers/Format');
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
      terminal = timer.media.terminal || true;
      computer = timer.media.computer || false;
      phone = timer.media.phone || false;
    }

    // Terminal is default
    if (terminal) {
      const time = Time.timeStringFromDate(new Date());
      const statusMessage = `${time} >>> ${timer.message} >>> ${Format.ordinal(displayCounter)} ${timer.name}`;
      Terminal.display(timer.bgColor, statusMessage);
    }

    if (computer) {
      const computerMessage = `${timer.message}\n${Format.ordinal(displayCounter)} ${timer.name}`;
      Computer.display(timer.title, computerMessage);
    }

    if (phone) {
      const phoneMessage = `${timer.message}\n${Format.ordinal(displayCounter)} ${timer.name}`;
      Phone.display(phoneMessage, timer.token);
    }
  }
}

module.exports = Alert;
