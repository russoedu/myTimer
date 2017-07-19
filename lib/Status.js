const Elapsy = require('elapsy');
const chalk = require('chalk');

const elapsy = new Elapsy();

class Status {
  static logTime() {
    elapsy.log('white', false);
    setTimeout(function() {
      if (global.runningTimer > 0) {
        Status.logTime();
      }
    }, 1000 * 1);
  };

  static display(color, textMessage) {
    console.log(chalk[color](`${textMessage}`));
  }
}

module.exports = Status;
