const env = require('dotenv').config();
const request = require('request');
const qs = require('qs');

class Pusher {
  static display(message) {
    const form = {
      token: process.env.PUSH_ME_TOKEN,
      title: message,
    }
    const formData = qs.stringify(form);
    const contentLength = formData.length;

    request({
      headers: {
        'Content-Length': contentLength,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      uri: 'https://pushmeapi.jagcesar.se',
      body: formData,
      method: 'POST'
    }, (err) => {
      if (err) {
        console.error(err);
      }
    });
  }
}

module.exports = Pusher;
