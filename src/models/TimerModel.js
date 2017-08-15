const debug = require('debug')('TimerModel');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const DefaultTimerModel = require('../models/DefaultTimerModel');
const Status = require('../views/Status');
const Time = require('../helpers/Time');

/**
 * Fill the reminder table with the correct times according to the timer
 * 'reminders' and 'endTime'. The timetable is filled in the Class object on
 * 'this.timer.reminders'
 * @private
 */
function setCronTable() {
  const time = new Time();
  const now = time.getStart();

  // Quantity is set and the quantity of reminders is less than or equal
  // the quantity (or no reminder was set)
  const quantity = !this.quantity ? 0 : this.quantity;
  // TODO fix in case the reminders set are after the endTime
  if (quantity > 0 || (!!this.reminders && this.reminders.length > 0)) {
    // Create an empty reminders array if none was set
    if (!this.reminders) {
      this.reminders = ['00:00:01'];
    } else if (this.reminders[0] === '00:00:00') {
      // Delay a second so the reminder can be displayed on after all calcs are made and is not
      // missed. The computation time makes the alerts start to display after some miliseconds
      // and the alert is not shown if it is set on the start time
      this.reminders[0] = '00:00:01';
    }

    let init = now;
    // this.reminders.forEach((reminder) => {
    //   init = Time.add(init, reminder);
    // });
    const left = quantity - this.reminders.length;
    this.reminders = Time.fillReminders(left, init, this.endTime, this.reminders);
    init = now;
    this.reminders.forEach((reminder, i) => {
      init = Time.add(init, reminder);
      this.reminders[i] = Time.stringToCron(init);
    });
    // debug(this);
  } else {
    const message = `Error on ${this.fileName} configuration. Please be sure that "quantity" is smaller or equal the length of "reminders".`;
    Status.error(`ERROR: ${message}`);
  }
}
/**
 * [exports description]
 * @type {[type]}
 */
class TimerModel {
  constructor(fileName) {
    return new Promise((resolve, reject) => {
      if (path.basename(fileName) === 'default.json' || path.extname(fileName) !== '.json') {
        debug(chalk.bgBlue(fileName, 'rejected'));
        // const error = new Error(false);
        reject();
      } else {
        debug(chalk.bgBlue(fileName, 'accepted'));
        fs.readFile(fileName, 'utf8', (err, data) => {
          if (err) {
            reject(err);
          } else {
            // Set the file name
            this.fileName = path.basename(fileName, '.json');

            // Merge the timer from the JSON with the default timer
            const defaultTimer = new DefaultTimerModel();
            const timer = defaultTimer.merge(JSON.parse(data));

            // Set this object with the merged timer
            Object.assign(this, timer, this);

            // Create the reminder table
            setCronTable.bind(this)();
            resolve(this);
          }
        });
      }
    });
  }
}

module.exports = TimerModel;
