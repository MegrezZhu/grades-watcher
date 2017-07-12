const Jwxt = require('sysu-jwxt');
const config = require('./config');
const schedule = require('node-schedule');
const align = require('wide-align');

const me = new Jwxt(config.netid, config.password);
const wi = require('wechat-inform')(config.wechat);

const recurRule = new schedule.RecurrenceRule();
recurRule.minute = [new schedule.Range(0, 60, 10)];

let pool = new Map();

me.login()
  .then(async () => {
    let grades = await me.getGrades('2016-2017', '2');
    grades.forEach(grade => {
      pool.set(grade.id, grade);
    });
    send('初始化', simplify(grades));

    schedule.scheduleJob(recurRule, async () => {
      let set = new Set();
      grades = await me.getGrades('2016-2017', '2');
      grades.forEach(grade => {
        if (!pool.has(grade.id)) {
          // new course grade!
          set.add(grade);
          pool.add(grade);
        }
      });
      if (set.size) {
        send('出成绩了', simplify([...set]));
      }
    });
  });

function send (status, message) {
  wi.send({
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

function simplify (grades) {
  return grades.map(grade => {
    let {course, score, rank} = grade;
    return `${align.center(course, 25)} ${align.center(score, 4)} ${align.center(rank, 6)}`;
  }).join('\n');
}
