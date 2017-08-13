const fs = require('fs');
const chalk = require('chalk');
const path = require('path');
const debug = require('debug')('DefaultTimerModel');

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
    const timersFolder = './timers/';
    const defaultPath = path.join(timersFolder, 'default.json');
    const defaultTimer = JSON.parse(fs.readFileSync(defaultPath), 'utf8');

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
    debug(chalk.bgCyan('>>>> merge <<<<'));
    debug(this.timer);
    debug(chalk.bgCyan('>>>> with <<<<'));
    debug(timer);
    Object.assign(timerConfig, this.timer, timer);

    // Remove alert on computer and phone if debug is enabled
    if (debug.enabled) {
      debug('debug enabled, set media to terminal only');
      timerConfig.media = {
        terminal: true,
        computer: false,
        phone: false,
      };
    }
    debug(chalk.bgCyan('>>>> result <<<<'));
    debug(timerConfig);
    return timerConfig;
  }
}

module.exports = DefaultTimerModel;
