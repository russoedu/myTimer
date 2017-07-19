const notifier = require('node-notifier');

class Notifier {
	static display(title, message) {
   const notifierMessage = {
     group: title,
     title: title,
     message: message,
     sound: true,
   }
   notifier.notify(notifierMessage);
  }
}

module.exports = Notifier;
