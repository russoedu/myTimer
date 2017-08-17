const fs = require('fs');
const chalk = require('chalk');
const path = require('path');
const debug = require('debug')('DefaultTimerModel');
const Time = require('../helpers/Time');

let instance = null;

/**
 * Singleton class that gets the default timer and has function to merge it
 * with the user's timers
 * @class DefaultTimerModel
 * @module Models
 */
class DefaultTimerModel {
  /**
   * Create the singleton instance and set the current time
   * @constructor
   * @return {Object} The singleton instance
   */
  constructor() {
    if (!instance) {
      instance = this;
    }
    const timersFolder = debug.enabled ? './test/timers' : './timers';
    const defaultPath = path.join(timersFolder, 'default.json');
    const defaultTimer = JSON.parse(fs.readFileSync(defaultPath), 'utf8');
    this.startTime = new Date();
    this.timer = defaultTimer;

    return instance;
  }

  /**
   * Merge the default config with the specific config, overwriting any default configuration set
   * in the specific
   * @method merge
   * @param  {Object} timer TimerModel object to be merged
   * @return {Object} The merged config object
   */
  merge(timer) {
    const timerConfig = {};
    Object.assign(timerConfig, this.timer, timer);

    // Remove alert on computer and phone if debug is enabled
    if (debug.enabled) {
      timerConfig.media = {
        terminal: true,
        computer: false,
        phone: false,
      };
      const time = new Time();
      timerConfig.endTime = Time.add(time.getStart(), '00:10:00');
      debug(chalk.bgCyan('debug enabled, endTime =', timerConfig.endTime));
    }
    return timerConfig;
  }
}

module.exports = DefaultTimerModel;
