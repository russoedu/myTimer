/* eslint-disable no-console */

/**
 * Class for displaying terminal status
 */
class Status {
  /**
   * Display terminal log
   * @param  {Mixed} obj Any type of variable
   */
  static log(obj) {
    console.log(obj);
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

module.exports = Status;
