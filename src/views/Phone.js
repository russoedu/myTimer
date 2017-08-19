/* eslint no-unused-vars: 0 */
const env = require('dotenv').config();
const request = require('request');
const chalk = require('chalk');
const qs = require('qs');
const Terminal = require('./Terminal');
const Format = require('../helpers/Format');

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
   * @return {Error} Returns error if no token is set
   */
  static display(message, token) {
    if (!(process.env.PUSH_ME_TOKEN || token)) {
      throw new Error('Token is not defined. Mobile notification can\'t be send.');
    }
    const form = {
      token: token || process.env.PUSH_ME_TOKEN,
      title: Format.ordinalReplace(message),
    };
    const formData = qs.stringify(form);

    const requestObj = {
      headers: {
        'Content-Length': formData.length,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      uri: 'https://pushmeapi.jagcesar.se',
      body: formData,
    };

    request.post(requestObj, (err) => {
      if (err) {
        throw err;
      }
    });
  }
}

module.exports = Phone;
