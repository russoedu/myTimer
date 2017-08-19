const Format = require('../helpers/Format');
const chalk = require('chalk');

/**
 * Class for displaying terminal status
 */
class Terminal {
  /**
   * Display on terminal
   * @param  {String} message String that will be displayed. You can use the pattern $number$ to
   *                          replace it for it's ordinal
   * @param  {String} color   The terminal display color
   * @param  {Number} length  The length that will be used for the ordinal number
   */
  static display(message, color, length) {
    const replaced = Format.ordinalReplace(message, length);
    process.stdout.write(`${chalk[color](replaced)}\n`);
  }

  /**
   * Display terminal error
   * @method error
   * @param  {Mixed} obj Any type of variable
   */
  static error(obj) {
    process.stdout.write(chalk.bgRed(`${obj}\n`));
  }
}

module.exports = Terminal;
