const fs = require('fs');
const path = require('path');
const Status = require('./lib/Status');
const Timer = require('./lib/Timer');

Status.logTime();

const timersFolder = './timers/';

// Get all JSON files in the timers folder
const files = fs.readdirSync(timersFolder);

// Set a global var to stop execution after all timers finish execution
global.runningTimer = files.length;

files.forEach(file => {
  var filePath = path.join(timersFolder, file);

  // Read each file content
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      Timer.start(JSON.parse(data));
    }
  });
})
