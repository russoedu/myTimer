const fs = require('fs');
const path = require('path');

/**
 * Class that get a timer
 * @class TimerModel
 * @module TimerModel
 */
class TimerModel {
  /**
   * Create the singleton instance and set the current time
   * @constructor
   * @return {Object} The singleton instance
   */
  constructor(fileName) {
    return new Promise((resolve, reject) => {
      if (fileName === 'default.json' || path.extname(fileName) !== '.json') {
        reject(false);
      }

      const timersFolder = './timers/';
      const filePath = path.join(timersFolder, fileName);

      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          reject(err);
        } else {
          this.data = data;
          this.name = path.basename(fileName, '.json');

          resolve(this);
        }
      });
    });
  }
}

module.exports = TimerModel;
