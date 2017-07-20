const Notifier = require('./Notifier');
const Pusher = require('./Pusher');
const Status = require('./Status');
const Format = require('./Format');
const Time = require('./Time');

class Timer {
  constructor(timer) {
    this.timer = timer;

    let timeTable = [];
    const nowDate = new Date();
    const now = `${nowDate.getHours()}:${nowDate.getMinutes()}`;

    if (timer.timeTable.length === 0) {
      timeTable = Time.distribute(timer.quantity, now, timer.endTime);
    } else if (timer.timeTable.length < timer.quantity) {
      const left = timer.quantity - timer.timeTable.length;
      timeTable = timer.timeTable.concat(Time.distribute(left, now, timer.endTime));
    }

    this.timer.timeTable = timeTable;
  }

  start(counter = 0, displayCounter = 1) {
    const timer = this.timer;

    const notifierMessage = `${timer.message}\n${Format.ordinal(displayCounter)} ${timer.name}`;
    const statusMessage = `${timer.message} >>> ${Format.ordinal(displayCounter)} ${timer.name}`;
    const pushMessage = `${timer.message}\n${Format.ordinal(displayCounter)} ${timer.name}`;

    Status.display(timer.bgColor, statusMessage);
    Notifier.display(timer.title, notifierMessage);
    Pusher.display(pushMessage);

    setTimeout(() => {
      counter = counter < timer.timeTable.length - 1 ?
                counter + 1 :
                timer.timeTable.length - 1;
      displayCounter++;

      this.start(counter, displayCounter);
    }, Time.milisecondsFromString(timer.timeTable[counter]));
  }
}

module.exports = Timer;
