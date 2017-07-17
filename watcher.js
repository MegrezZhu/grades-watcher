const Jwxt = require('sysu-jwxt');
const WechatInform = require('wechat-inform');
const schedule = require('node-schedule');
const align = require('wide-align');
const {logger} = require('./lib');
const assert = require('assert');

class Watcher {
  constructor (config) {
    this.me = new Jwxt(config.netid, config.password, {logger});
    this.wi = WechatInform(config.wechat);
    this.pool = new Map();
    this.config = config;
  }

  async start (scheduleConfig) {
    logger.info('initializing');

    await this.me.login();
    let grades = await this.me.getGrades(this.config.watch.year, this.config.watch.semester);
    logger.info(`initial grades: ${grades.map(o => o.course)}`);
    this.send('初始化成功，开始轮询', '当前已有\n' + simplify(grades));

    schedule.scheduleJob(scheduleConfig, this.task.bind(this));

    logger.info('done');
  }

  async task (year, semester) {
    try {
      logger.info('querying');
      let set = [];
      let grades = await this.me.getGrades(year, semester);

      assert(grades.length >= this.pool.size, 'error: incomplete grades list');

      grades.forEach(grade => {
        if (!this.pool.has(grade.id)) {
          // new course grade!
          logger.info(`new grade: ${grade.course}`);
          set.push(grade);
          this.pool.add(grade);
        }
      });
      if (set.size) {
        this.send('出成绩了', simplify(set));
      }
    } catch (err) {
      // re-login
      logger.error('failed, re-login');
      this.me.login();
    }
  }

  send (status, message) {
    this.wi.send({
      data: {
        status: {
          value: status,
          color: '#337ab7'
        },
        message: {
          value: message
        }
      }
    });
  }
}

module.exports = Watcher;

function simplify (grades) {
  return grades.map(grade => {
    let {course, score, rank} = grade;
    return `${align.center(course, 25)} ${align.center(score, 4)} ${align.center(rank, 6)}`;
  }).join('\n');
}
