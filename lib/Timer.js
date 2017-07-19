const Notifier = require('./Notifier');
const Pusher = require('./Pusher');
const Status = require('./Status');
const Format = require('./Format');

/**
 * Check if the execution must end because of the limit hour of the day.
 * @method continueRunning
 * @return {Boolean} True if should run again
 *
 */
function continueRunning() {
  if (new Date().getHours() < 24) {
    return true;
  }
  return false;
}

class Timer {
  static start(timer, counter = 0, displayCounter = 1) {
    const notifierMessage = `${timer.message}\n${Format.ordinal(displayCounter)} ${timer.name}`;
    const statusMessage = `${timer.message} >>> ${Format.ordinal(displayCounter)} ${timer.name}`;
    const pushMessage = `${timer.message}\n${Format.ordinal(displayCounter)} ${timer.name}`;

    Status.display(timer.bgColor, statusMessage);
    Notifier.display(timer.title, notifierMessage);
    Pusher.display(pushMessage);

    setTimeout(function() {
      counter = counter < timer.timeTable.length - 1 ?
                counter + 1 :
                timer.timeTable.length - 1;
      displayCounter++;

      if (continueRunning()) {
        Timer.start(timer, counter, displayCounter);
      } else {
        global.runningTimer--;
      }

    }, Format.time(timer.timeTable[counter]));
  }
}

module.exports = Timer;
