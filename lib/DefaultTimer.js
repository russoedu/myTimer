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

  merge(timerJson) {
    const timerConfig = {};
    Object.assign(timerConfig, this.defaultTimer, JSON.parse(timerJson));
    return timerConfig;
  }
}

module.exports = DefaultTimer;
