const fs = require('fs');
const path = require('path');
const Status = require('./lib/Status');
const Timer = require('./lib/Timer');

Status.logTime();

const timersFolder = './timers/';
const globalTimerPath = path.join(timersFolder, 'default.json');

// Read the timers global configuration
const globalTimer = JSON.parse(fs.readFileSync(globalTimerPath), 'utf8');

// Set a global var to stop execution after all timers finish execution
// TODO fix this
// global.runningTimer = files.length;

const files = fs.readdirSync(timersFolder);
 {};

files.forEach(file => {
  const filePath = path.join(timersFolder, file);

  // Read each file content
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else if (file !== 'default.json'){
      const timerConfig = {};
      // Merge the global timer config overwriting each data with the current
      // timer config
      Object.assign(timerConfig, globalTimer, JSON.parse(data));
      const timer = new Timer(timerConfig);
      timer.start();
    }
  });
})
