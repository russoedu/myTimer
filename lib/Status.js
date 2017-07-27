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
    /* eslint-disable no-console */
    console.log(chalk[color](`${textMessage}`));
  }
}

module.exports = Status;
