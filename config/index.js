const secret = require('./secret');

module.exports = Object.assign({
  logDir: 'logs',
  wechat: {},
  watch: {
    year: '2016-2017',
    semester: '2'
  }
}, secret);
