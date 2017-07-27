/* eslint-disable no-console */
/* eslint no-unused-vars: 0 */
const env = require('dotenv').config();
const request = require('request');
const chalk = require('chalk');
const qs = require('qs');

class Pusher {
  static display(message) {
    if (!process.env.PUSH_ME_TOKEN) {
      console.error(chalk.red('ERROR: PUSH_ME_TOKEN is not defined. Mobile notification can\'t be send.'));
    } else {
      const form = {
        token: process.env.PUSH_ME_TOKEN,
        title: message,
      };
      const formData = qs.stringify(form);
      const contentLength = formData.length;

      request({
        headers: {
          'Content-Length': contentLength,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        uri: 'https://pushmeapi.jagcesar.se',
        body: formData,
        method: 'POST',
      }, (err) => {
        if (err) {
          console.error(err);
        }
      });
    }
  }
}

module.exports = Pusher;
