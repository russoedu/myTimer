const Notifier = require('./Notifier');
const Pusher = require('./Pusher');
const Status = require('./Status');

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

function convertTime(time) {
  var parts = time.split(":");
  return (parts[0] * 1000 * 60 * 60 + parts[1] * 1000 * 60 + parts[2] * 1000);
}

class Timer {
  static start(timer, counter = 0, displayCounter = 1) {
    const notifierMessage = `${timer.message}\n${displayCounter}º ${timer.name}`;
    const statusMessage = `${timer.message} >>> ${displayCounter}º ${timer.name}`;
    const pushMessage = `${timer.message}\n${displayCounter}º ${timer.name}`;

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

    }, timer.timeTable[counter] * 1000 * 60 * 60);
    // }, timer.timeTable[counter] * 20); // Debug timer
  }
}

module.exports = Timer;
