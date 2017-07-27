const debug = require('debug')('index');
const fs = require('fs');
const path = require('path');
const Status = require('./lib/Status');
const Timer = require('./lib/Timer');
const Time = require('./lib/Time');

// Start the status and the start time
Status.logTime();
const time = new Time();
debug(time.getStart());

const timersFolder = './timers/';

// Set a global var to stop execution after all timers finish execution
// TODO fix this
// global.runningTimer = files.length;

const files = fs.readdirSync(timersFolder);

files.forEach((file) => {
  const filePath = path.join(timersFolder, file);

  // Read each file content
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else if (file !== 'default.json') {
      const timer = new Timer(data, file);
      timer.start();
    }
  });
});
