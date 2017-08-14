const Alert = require('../views/Alert');
const Status = require('../views/Status');
const Time = require('../helpers/Time');
const Format = require('../helpers/Format');
const chalk = require('chalk');
// const debug = require('debug')('Timer');
const CronJob = require('cron').CronJob;

/**
 * Run the reminders of a TimerModel object
 * @example
 * new Timer(timerModel)
 *  .then((timer) => {
 *    ...
 *  })
 * .catch((err) => {
 *    if (err) {
 *      console.error(err);
 *    }
 *  });
 */
class Timer {
  /**
   * Timer constructor. Set the TimerModel into the Timer
   * @param  {TimerModel}    timer The timer model created from the JSON
   * @return {Promise<Timer|null>} Return the Timer object with the reminder filled
   */
  constructor(timer) {
    return new Promise((resolve) => {
      this.timer = timer;
      resolve(this);
    });
  }

  /**
   * Create eachRun recursively displaying the reminder's alerts and wait for each reminder's time.
   * Stops when counter reaches the timer reminder's length.
   */
  start() {
    const timer = this.timer;
    Status.log(chalk.bgGreen(`Starting ${timer.fileName} reminders until ${timer.endTime}`));
    this.timer.reminders.forEach((reminder, i) => {
      const ordinal = Format.fixedLength(Format.ordinal(i + 1), 4);
      Status.log(chalk.green(`${ordinal} ${timer.name} on ${Time.cronToString(reminder)}`));
      const job = new CronJob({
        cronTime: reminder,
        onTick() {
          Alert.display(timer, i + 1);
          this.stop();
        },
        start: false,
      });
      job.start();
    });
  }
}

module.exports = Timer;
