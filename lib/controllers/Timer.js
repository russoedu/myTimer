const debug = require('debug')('TimerController');
const Alert = require('../views/Alert');
const Status = require('../views/Status');
const Time = require('../helpers/Time');
const DefaultTimerModel = require('../models/DefaultTimerModel');

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
  Status.log(`Reminders for ${this.fileName}`);
  if (!!tm.quantity && (!tm.reminders || tm.reminders.length <= tm.quantity)) {
    debug('setReminderTable', this.fileName, 'case 1');
    // Create an empty reminders array if none was set
    if (!tm.reminders) {
      tm.reminders = [];
    }

    const left = tm.quantity - tm.reminders.length - 1;
    reminders = Time.fillReminder(left, now, tm.endTime, tm.reminders, true);
  } else if (!tm.quantity && !!tm.reminders && tm.reminders.length > 0) {
    debug('setReminderTable', this.fileName, 'case 2');
    const quantity = tm.reminders.length - 1;
    reminders = Time.fillReminder(quantity, now, tm.endTime, tm.reminders, true);
  } else {
    debug('setReminderTable', this.fileName, 'case 3 - error');
    const message = `Error on ${this.fileName} configuration. Please be sure that "quantity" is smaller or equal the length of "reminders".`;
    Status.error(`ERROR: ${message}`);
  }
  this.timer.reminders = reminders;
  debug(this.timer);
}
/**
 * Run the timer reminders
 * @class Timer
 * @module Timer
 */
class Timer {
  /**
   * Timer constructor. Set the alerts time table
   * @method constructor
   * @param  {Object}    timerJson The timer from the 'timers' folder
   * @param  {String}    fileName  The name of the file
   */
  constructor(timerJson, fileName) {
    return new Promise((resolve, reject) => {
      if (fileName === 'default.json') {
        reject();
      } else {
        const defaultTimer = new DefaultTimerModel();

        this.fileName = fileName;
        this.timer = defaultTimer.merge(timerJson);

        setReminderTable.bind(this)();

        resolve(this);
      }
    });
  }

  /**
   * Start the timer and display the alert on each reminders
   * @method start
   * @param  {Number} [counter=0] The number of the iteration
   */
  start(counter = 0) {
    Alert.display(this.timer, counter + 1);

    if (counter < this.timer.reminders.length) {
      setTimeout(() => {
        this.start(counter + 1);
      }, Time.milisecondsFromString(this.timer.reminders[counter]));
    }
  }
}

module.exports = Timer;
