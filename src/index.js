const fs = require('fs');
const Terminal = require('./views/Terminal');
const Timer = require('./controllers/Timer');
const TimerModel = require('./models/TimerModel');
const path = require('path');

/**
 * Initiate the process, reading each JSON in 'timers' folder
 */
const folder = './timers';
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
          Terminal.error(err);
        }
      });
  });
