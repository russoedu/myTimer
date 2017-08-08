const debug = require('debug')('index');
const fs = require('fs');
const Status = require('./views/Status');
const Timer = require('./controllers/Timer');
const TimerModel = require('./models/TimerModel');
const Time = require('./helpers/Time');

// Start the status and the start time
const time = new Time();
debug(time.getStart());

/**
 * Initiate the process, reading each JSON in 'timers' folder
 */
fs.readdirSync('./timers/')
  .forEach((file) => {
    new TimerModel(file)
      .then(timerData => new Timer(timerData))
      .then((timer) => {
        timer.start();
      })
      .catch((err) => {
        if (err) {
          Status.error(err);
        }
      });
  });
