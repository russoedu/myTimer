/* eslint-disable no-console */
const chalk = require('chalk');

/**
 * Class for displaying terminal alerts
 *
 */
module.exports = class Terminal {
  /**
   * Display a terminal alert
   * @param  {string} color Background color from 'chalk'
   * @param  {string} message Message of the alert
   * @example
   * Terminal.display('bgGreen', "This is my terminal message");
   */
  static display(color, message) {
    console.log(chalk[color](`${message}`));
  }
};
