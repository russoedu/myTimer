/* eslint-disable no-console */
const Format = require('../helpers/Format');
const chalk = require('chalk');

/**
 * Class for displaying terminal status
 */
class Terminal {
  /**
   * Display terminal log
   * @param  {String} str    String that will be displayed. You can use the pattern $number$ to
   *                         replace it for it's ordinal
   * @param  {String} color  The terminal display color
   * @param  {Number} length The length that will be used for the ordinal number
   */
  static log(str, color, length) {
    let replaced = str;
    const ordinalRegEx = /\$([0-9]+)\$/img;
    const match = ordinalRegEx.exec(str);
    if (match) {
      const leng = length || Format.ordinal(match[1]).length;
      const ordinal = Format.fixedLength(Format.ordinal(match[1]), leng);
      replaced = str.replace(ordinalRegEx, ordinal);
    }
    console.log(chalk[color](replaced));
  }

  /**
   * Display terminal error
   * @method error
   * @param  {Mixed} obj Any type of variable
   */
  static error(obj) {
    console.error(obj);
  }
}

module.exports = Terminal;
