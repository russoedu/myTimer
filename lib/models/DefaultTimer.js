const fs = require('fs');
const path = require('path');

let instance = null;

/**
 * Singleton class that gets the default timer and has function to merge it
 * with the user's timers
 * @class DefaultTimer
 * @module DefaultTimer
 */
class DefaultTimer {
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

    this.defaultTimer = defaultTimer;

    return instance;
  }

  /**
   * Merge the default config with the specific config, overwriting any default configuration set
   * in the specific
   * @method merge
   * @param  {String} timerJson The config `json` string
   * @return {Object} The merged config object
   */
  merge(timerJson) {
    const timerConfig = {};
    Object.assign(timerConfig, this.defaultTimer, JSON.parse(timerJson));
    return timerConfig;
  }
}

module.exports = DefaultTimer;
