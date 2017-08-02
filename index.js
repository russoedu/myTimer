const debug = require('debug')('index');
const fs = require('fs');
const Status = require('./lib/views/Status');
const Timer = require('./lib/controllers/Timer');
const TimerModel = require('./lib/models/TimerModel');
const Time = require('./lib/helpers/Time');

// Start the status and the start time
const time = new Time();
debug(time.getStart());

fs.readdirSync('./timers/')
  .forEach((file) => {
    new TimerModel(file)
      .then(timerModel => new Timer(timerModel.data, timerModel.name))
      .then((timer) => {
        timer.start();
      })
      .catch((err) => {
        if (err) {
          Status.error(err);
        }
      });
  });
