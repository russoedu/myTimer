/* eslint-disable no-console */
const chalk = require('chalk');

class Status {
  static display(color, textMessage) {
    console.log(chalk[color](`${textMessage}`));
  }
  static show(obj) {
    console.log(obj);
  }
  static error(obj) {
    console.error(obj);
  }
}

module.exports = Status;
