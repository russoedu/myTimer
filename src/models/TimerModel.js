const fs = require('fs');
const path = require('path');
const debug = require('debug')('TimerModel');
const Time = require('../helpers/Time');
const Status = require('../views/Status');
const DefaultTimerModel = require('../models/DefaultTimerModel');

/**
 * Fill the reminder table with the correct times according to the timer
 * 'reminders' and 'endTime'. The timetable is filled in the Class object on
 * 'this.timer.reminders'
 * @private
 */
function setReminderTable() {
  const reminders = [];
  const time = new Time();
  const now = time.getStart();

  // Quantity is set and the quantity of reminders is less than or equal
  // the quantity (or no reminder was set)
  Status.log(`Reminders for ${this.fileName}`);
  if (!!this.quantity && (!this.reminders || this.reminders.length <= this.quantity)) {
    debug('setReminderTable', this.fileName, 'case 1');
    // Create an empty reminders array if none was set
    if (!this.reminders) {
      this.reminders = [];
    }

    const left = this.quantity - this.reminders.length - 1;
    this.reminders = Time.fillReminder(left, now, this.endTime, this.reminders, true);
  } else if (!this.quantity && !!this.reminders && this.reminders.length > 0) {
    debug('setReminderTable', this.fileName, 'case 2');
    const quantity = this.reminders.length - 1;
    this.reminders = Time.fillReminder(quantity, now, this.endTime, this.reminders, true);
  } else {
    debug('setReminderTable', this.fileName, 'case 3 - error');
    const message = `Error on ${this.fileName} configuration. Please be sure that "quantity" is smaller or equal the length of "reminders".`;
    Status.error(`ERROR: ${message}`);
  }
  Object.assign(this, reminders, this);
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
    debug('constructor', fileName);
    return new Promise((resolve, reject) => {
      if (fileName === 'default.json' || path.extname(fileName) !== '.json') {
        reject(null);
      } else {
        const timersFolder = './timers/';
        const filePath = path.join(timersFolder, fileName);

        fs.readFile(filePath, 'utf8', (err, data) => {
          if (err) {
            reject(err);
          } else {
            // Set the file name
            this.fileName = path.basename(fileName, '.json');

            // Create the object

            // Fill with the default
            const defaultTimer = new DefaultTimerModel();
            const timer = defaultTimer.merge(JSON.parse(data));
            Object.assign(this, timer, this);
            debug('before setReminders table', this);
            setReminderTable.bind(this)();
            resolve(this);
          }
        });
      }
    });
  }
}

module.exports = TimerModel;
