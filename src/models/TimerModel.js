const fs = require('fs');
const path = require('path');
const debug = require('debug')('TimerModel');
const Time = require('../helpers/Time');
const Status = require('../views/Status');
const DefaultTimerModel = require('../models/DefaultTimerModel');
const chalk = require('chalk');
/**
 * Fill the reminder table with the correct times according to the timer
 * 'reminders' and 'endTime'. The timetable is filled in the Class object on
 * 'this.timer.reminders'
 * @private
 */
function setReminderTable() {
  const time = new Time();
  const now = time.getStart();

  // Quantity is set and the quantity of reminders is less than or equal
  // the quantity (or no reminder was set)
  const quantity = !this.quantity ? 0 : this.quantity;
  // TODO fix in case the reminders set are after the endTime
  if (quantity > 0 || (!!this.reminders && this.reminders.length > 0)) {
    // Create an empty reminders array if none was set
    if (!this.reminders) {
      this.reminders = ['00:00:00'];
    }
    const left = quantity - this.reminders.length;
    debug(chalk.bgBlue(this.fileName, 'quantity: ', quantity));
    debug(chalk.bgBlue(this.fileName, 'reminders:', this.reminders.length));
    debug(chalk.bgBlue(this.fileName, 'left:     ', left));
    this.reminders = Time.fillReminder(left, now, this.endTime, this.reminders);
  } else {
    debug(chalk.bgRed('setReminderTable', this.fileName, ' - error'));
    const message = `Error on ${this.fileName} configuration. Please be sure that "quantity" is smaller or equal the length of "reminders".`;
    Status.error(`ERROR: ${message}`);
  }
}


/**
 * TimerModel class sets all needed data for a timer controller to run
 * @example
 * new TimerModel(file)
 *   .then(timer => {
 *     console.log(timer);
 *   });
 * // The TimerModel object
 * TimerModel {
 *  fileName: 'water',
 *  title: 'Water time',
 *  message: '🚰  Drink a glass of water!',
 *  name: 'glass',
 *  endTime: '22:00:00',
 *  bgColor: 'bgBlue',
 *  quantity: 4,
 *  media: {
 *    terminal: false,
 *    computer: false,
 *    phone: true
 *  },
 *  reminders: [
 *    '00:25:24',
 *    '00:25:24',
 *    '00:25:24'
 *  ]
 * }
 *
 *
 */
class TimerModel {
  /**
   * Create a TimerModel object from a JSON, set it's file name and merge with the default timer.
   * Ignores 'default.json' and fileNames that's not a JSON (by it's extention).
   * @param  {String}    fileName Name of the timer JSON
   * @return {Promise<TimerModel|Error>} TimerModel object with all data on the JSON, plus it's
   * name and data merged from the default timer
   */
  constructor(fileName) {
    debug(chalk.bgBlue('constructor', fileName));
    return new Promise((resolve, reject) => {
      if (fileName === 'default.json' || path.extname(fileName) !== '.json') {
        debug(chalk.bgBlue(fileName, 'rejected'));
        reject(null);
      } else {
        debug(chalk.bgBlue(fileName, 'accepted'));
        const timersFolder = debug.enabled ? './timers-debug' : './timers';
        const filePath = path.join(timersFolder, fileName);

        fs.readFile(filePath, 'utf8', (err, data) => {
          if (err) {
            debug(chalk.bgRed(fileName, 'error'));
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
            setReminderTable.bind(this)();
            debug(this);
            resolve(this);
          }
        });
      }
    });
  }
}

module.exports = TimerModel;
