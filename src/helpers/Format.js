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

  /**
   * Display on terminal
   * @param  {String} str    String that will be used to replace ordinals. Use the pattern $number$
   *                         to replace it for it's ordinal
   * @param  {Number} length The length that will be used for the ordinal number
   */
  static ordinalReplace(str, length) {
    let replaced = str;
    const ordinalRegEx = /\$([0-9]+)\$/img;
    const match = ordinalRegEx.exec(str);
    if (match) {
      const leng = length || Format.ordinal(match[1]).length;
      const ordinal = Format.fixedLength(Format.ordinal(match[1]), leng);
      replaced = str.replace(ordinalRegEx, ordinal);
    }
    return replaced;
  }

  static fixedLength(str, length) {
    const newStr = str.toString();
    return ' '.repeat(length - newStr.length) + newStr;
  }
}

module.exports = Format;
