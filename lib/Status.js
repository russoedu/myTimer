/* eslint-disable no-console */
const Elapsy = require('elapsy');
const chalk = require('chalk');

const elapsy = new Elapsy();

class Status {
  static logTime() {
    elapsy.log('white', false);
    setTimeout(() => {
      Status.logTime();
    }, 1000);
  }

  static display(color, textMessage) {
    console.log(chalk[color](`${textMessage}`));
  }
  static show(obj) {
    console.log(obj);
  }
}

module.exports = Status;
