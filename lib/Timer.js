const debug = require('debug')('Timer');
const Notifier = require('./Notifier');
const Pusher = require('./Pusher');
const Status = require('./Status');
const Format = require('./Format');
const Time = require('./Time');
const DefaultTimer = require('./DefaultTimer');

/**
 * Fill the reminder table with the correct times according to the timer
 * 'reminders' and 'endTime'. The timetable is filled in the Class object on
 * 'this.timer.reminders'
 * @method setReminderTable
 * @private
 */
function setReminderTable() {
  let reminders = [];
  const tm = this.timer;
  const time = new Time();
  const now = time.getStart();

  // Quantity is set and the quantity of reminders is less than or equal
  // the quantity (or no reminder was set)
  Status.show(`Reminders for ${this.fileName}`);
  if (!!tm.quantity && (!tm.reminders || tm.reminders.length <= tm.quantity)) {
    debug('setReminderTable', this.fileName, 'case 1');
    // Create an empty reminders array if none was set
    if (!tm.reminders) {
      tm.reminders = [];
    }

    const left = tm.quantity - tm.reminders.length - 1;
    reminders = tm.reminders.concat(Time.distribute(left, now, tm.endTime, tm.reminders, true));
  } else if (!tm.quantity && !!tm.reminders && tm.reminders.length > 0) {
    debug('setReminderTable', this.fileName, 'case 2');
    const quantity = tm.reminders.length - 1;
    reminders = tm.reminders.concat(Time.distribute(quantity, now, tm.endTime, tm.reminders, true));
  } else {
    debug('setReminderTable', this.fileName, 'case 3 - error');
    const message = `Error on ${this.fileName} configuration. Please be sure that "quantity" is smaller or equal the length of "reminders".`;
    Status.display(tm.bgColor, message);
    Notifier.display('ERROR', message);
  }
  this.timer.reminders = reminders;
  debug(this.timer);
}

/**
 * Display the alerts
 * @method alert
 * @param  {[type]} timer          [description]
 * @param  {[type]} displayCounter [description]
 * @return {[type]}
 */
function alert(timer, displayCounter) {
  // Terminal is default
  if (timer.media.terminal === undefined || timer.media.terminal === true) {
    const statusMessage = `${timer.message} >>> ${Format.ordinal(displayCounter)} ${timer.name}`;
    Status.display(timer.bgColor, statusMessage);
  }

  if (timer.media.computer !== undefined && timer.media.computer === true) {
    const notifierMessage = `${timer.message}\n${Format.ordinal(displayCounter)} ${timer.name}`;
    Notifier.display(timer.title, notifierMessage);
  }

  if (timer.media.phone !== undefined && timer.media.phone === true) {
    const pushMessage = `${timer.message}\n${Format.ordinal(displayCounter)} ${timer.name}`;
    Pusher.display(pushMessage);
  }
}

class Timer {
  /**
   * Timer constructor. Set the alerts time table
   * @method constructor
   * @param  {Object}    timerJson The timer from the 'timers' folder
   * @param  {String}    fileName  The name of the file
   */
  constructor(timerJson, fileName) {
    if (fileName !== 'default.json') {
      const defaultTimer = new DefaultTimer();

      this.fileName = fileName;
      this.timer = defaultTimer.merge(timerJson);

      setReminderTable.bind(this)();
    }
  }

  /**
   * Start the timer and display the alert on each reminders
   * @method start
   * @param  {Number} [counter=0] The number of the iteration
   */
  start(counter = 0) {
    alert(this.timer, counter + 1);

    if (counter < this.timer.reminders.length) {
      setTimeout(() => {
        this.start(counter + 1);
      }, Time.milisecondsFromString(this.timer.reminders[counter]));
    }
  }
}

module.exports = Timer;
