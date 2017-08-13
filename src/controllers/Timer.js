const Alert = require('../views/Alert');
const debug = require('debug')('Timer');
const Time = require('../helpers/Time');

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
   * Run recursively displaying the reminder's alerts and wait for each reminder's time.
   * Stops when counter reaches the timer reminder's length.
   * @param  {Number} [counter = 0] The number of the iteration
   */
  start(counter = 0) {
    if (counter < this.timer.reminders.length) {
      setTimeout(() => {
        debug(this.timer.fileName, counter + 1);
        Alert.display(this.timer, counter + 1);
        this.start(counter + 1);
      }, Time.milisecondsFromString(this.timer.reminders[counter]));
    }
  }
}

module.exports = Timer;
