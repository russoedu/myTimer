/* eslint no-unused-vars: 0 */
const env = require('dotenv').config();
const request = require('request');
const chalk = require('chalk');
const qs = require('qs');
const Status = require('./Status');

/**
 * Class for displaying phone alerts
 * @class Phone
 * @module Alert
 */
class Phone {
  /**
   * Display a phone alert (push notification) using "Push me" app
   * @method display
   * @param  {String} message Message of the alert
   */
  static display(message, token) {
    if (!(process.env.PUSH_ME_TOKEN || token)) {
      Status.error(chalk.red('ERROR: PUSH_ME_TOKEN is not defined. Mobile notification can\'t be send.'));
    } else {
      const form = {
        token: token || process.env.PUSH_ME_TOKEN,
        title: message,
      };
      const formData = qs.stringify(form);

      const requestObj = {
        headers: {
          'Content-Length': formData.length,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        uri: 'https://pushmeapi.jagcesar.se',
        body: formData,
        method: 'POST',
      };

      request(requestObj, (err) => {
        if (err) {
          Status.error(err);
        }
      });
    }
  }
}

module.exports = Phone;
