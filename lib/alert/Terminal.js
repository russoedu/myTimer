/* eslint-disable no-console */
const chalk = require('chalk');
/**
 * Class for displaying terminal alerts
 * @class Terminal
 * @module Alert
 */
class Terminal {
  /**
   * Display a terminal alert
   * @method display
   * @param  {String} message Message of the alert
   */
  static display(color, message) {
    console.log(chalk[color](`${message}`));
  }
}

module.exports = Terminal;
