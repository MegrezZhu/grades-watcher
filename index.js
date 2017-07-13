const config = require('./config');
const Watcher = require('./watcher');
const _ = require('lodash');

const watcher = new Watcher(config);
watcher.start({
  minute: _.range(0, 60, 5)
});

process.on('uncaughtException', err => {
  watcher.send('错误', err.stack);
});

process.on('unhandledRejection', err => {
  watcher.send('错误', err.stack);
});
