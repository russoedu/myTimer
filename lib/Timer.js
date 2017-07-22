const debug = require('debug')('Timer');
const Notifier = require('./Notifier');
const Pusher = require('./Pusher');
const Status = require('./Status');
const Format = require('./Format');
const Time = require('./Time');
const DefaultTimer = require('./DefaultTimer');

function setReminderTable() {
  let reminders = [];
  const tm = this.timer;
  const time = new Time();
  const now = time.getStart();

  // Quantity is set and the quantity of reminders is less than or equal
  // the quantity (or no reminder was set)
  if (!!tm.quantity && (!tm.reminders || tm.reminders.length <= tm.quantity)) {
    debug('setReminderTable', this.fileName, 'case 1');
    // Create an empty reminders array if none was set
    if (!tm.reminders) {
      tm.reminders = [];
    }

    const left = tm.quantity - tm.reminders.length;
    reminders = tm.reminders.concat(Time.distribute(left, now, tm.endTime, tm.reminders));
  } else if (!tm.quantity && !!tm.reminders && tm.reminders.length > 0) {
    debug('setReminderTable', this.fileName, 'case 2');
    const quantity = tm.reminders.length;
    reminders = tm.reminders.concat(Time.distribute(quantity, now, tm.endTime, tm.reminders));
  } else {
    debug('setReminderTable', this.fileName, 'case 3 - error');
    const message = `Error on ${fileName} configuration. Please be sure that "quantity" is smaller or equal the length of "reminders".`;
    Status.display(tm.bgColor, message);
    Notifier.display("ERROR", message);
  }
  this.timer.reminders = reminders;
  debug(this.timer);
}

class Timer {
  constructor(timerJson, fileName) {
    if (fileName !== 'default.json') {
      this.fileName = fileName;
      const defaultTimer = new DefaultTimer();
      this.timer = defaultTimer.merge(timerJson);
      setReminderTable.bind(this)();
    }
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
      counter = counter < timer.reminders.length - 1 ?
                counter + 1 :
                timer.reminders.length - 1;
      displayCounter++;

      this.start(counter, displayCounter);
    }, Time.milisecondsFromString(timer.reminders[counter]));
  }
}

module.exports = Timer;
