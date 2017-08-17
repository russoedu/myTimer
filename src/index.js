const debug = require('debug')('index');
const fs = require('fs');
const Terminal = require('./views/Terminal');
const Timer = require('./controllers/Timer');
const TimerModel = require('./models/TimerModel');
const path = require('path');
const Time = require('./helpers/Time');
const chalk = require('chalk');

// Start the status and set the start time (singleton object data)
const time = new Time();
debug(chalk.black.bgYellow('start: ', time.getStart()));

/**
 * Initiate the process, reading each JSON in 'timers' folder
 */
const folder = debug.enabled ? './test/timers' : './timers';
fs.readdirSync(folder)
  .forEach((file) => {
    const filePath = path.join(folder, file);
    new TimerModel(filePath)
      .then(timerData => new Timer(timerData))
      .then((timer) => {
        timer.start();
      })
      .catch((err) => {
        if (err) {
          debug(err);
          Terminal.error(err);
        }
      });
  });
