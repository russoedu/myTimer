const notifier = require('node-notifier');

/**
 * Class for displaying computer alerts
 * @class Computer
 * @module Alert
 */
class Computer {
  /**
   * Display a computer alert
   * @method display
   * @param  {String} title   Title of the alert
   * @param  {String} message Message of the alert
   */
  static display(title, message) {
    const notifierMessage = {
      group: title,
      sound: true,
      title,
      message,
    };
    notifier.notify(notifierMessage);
  }
}

module.exports = Computer;
