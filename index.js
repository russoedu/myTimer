const debug = require('debug')('index');
const fs = require('fs');
const path = require('path');
const Status = require('./lib/views/Status');
const Timer = require('./lib/controllers/Timer');
const Time = require('./lib/helpers/Time');

// Start the status and the start time
const time = new Time();
debug(time.getStart());

const timersFolder = './timers/';

const files = fs.readdirSync(timersFolder);

files.forEach((file) => {
  const filePath = path.join(timersFolder, file);

  // Read each file content
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      Status.error(err);
    } else if (file !== 'default.json') {
      const timer = new Timer(data, file);
      timer.start();
    }
  });
});
