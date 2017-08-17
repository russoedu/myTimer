/**
 * Class to format numbers
 * @class
 * @module Alert
 */
class Format {
  /**
   * Display the correct ordinal notation of a number
   * @method ordinal
   * @param  {Number} num The number to be formated
   * @return {String} The number with it's ordinal notation (i.e. 11th)
   */
  static ordinal(num) {
    const j = num % 10;
    const k = num % 100;

    if (j === 1 && k !== 11) {
      return `${num}st`;
    }
    if (j === 2 && k !== 12) {
      return `${num}nd`;
    }
    if (j === 3 && k !== 13) {
      return `${num}rd`;
    }
    return `${num}th`;
  }

  static fixedLength(str, length) {
    const newStr = str.toString();
    return ' '.repeat(length - newStr.length) + newStr;
  }
}

module.exports = Format;
