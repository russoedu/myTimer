const debug = require('debug')('index');
const fs = require('fs');
const Status = require('./views/Status');
const Timer = require('./controllers/Timer');
const TimerModel = require('./models/TimerModel');
// const CronModel = require('./models/CronModel');
const Time = require('./helpers/Time');
const chalk = require('chalk');

// Start the status and set the start time (singleton object data)
const time = new Time();
debug(chalk.black.bgYellow('start: ', time.getStart()));

/**
 * Initiate the process, reading each JSON in 'timers' folder
 */
const folder = debug.enabled ? './timers-debug' : './timers';
fs.readdirSync(folder)
  .forEach((file) => {
    new TimerModel(file)
      .then(timerData => new Timer(timerData))
      .then((timer) => {
        timer.start();
      })
      .catch((err) => {
        if (err) {
          debug(err);
          Status.error(err);
        }
      });
  });
