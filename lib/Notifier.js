const notifier = require('node-notifier');

class Notifier {
  static display(title, message) {
    const notifierMessage = {
      group: title,
      sound: true,
      title,
      message,
    };
    notifier.notify(notifierMessage);
  }
}

module.exports = Notifier;
