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
    let media = timer.media;

    if (media === undefined) {
      media = {
        terminal: true,
        computer: false,
        phone: false,
      };
    }

    // Terminal is default
    if (media.terminal) {
      const time = Time.toString(new Date());
      const statusMessage = ` ${time} >>> ${timer.message} >>> $${displayCounter}$ ${timer.name} `;
      Terminal.display(statusMessage, timer.bgColor);
    }

    if (media.computer) {
      const computerMessage = `${timer.message}\n$${displayCounter}$ ${timer.name}`;
      Computer.display(timer.title, computerMessage);
    }

    if (media.phone) {
      const phoneMessage = `${timer.message}\n$${displayCounter}$ ${timer.name}`;
      Phone.display(phoneMessage, timer.token);
    }
  }
}

module.exports = Alert;
