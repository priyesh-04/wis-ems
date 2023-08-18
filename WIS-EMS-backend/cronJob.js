const CronJob = require('cron').CronJob;
const { TimesheetCron } = require('./middlewares/cronJobs');

const cronFunction = () => {
  console.log('Cron Job Started.');

  new CronJob(
    // run at 7:30:00 AM all day
    '0 30 7 * * *',
    function () {
      TimesheetCron.resetTimesheetEditPermission();  // new -> initial
      console.log('All Timesheet edit permission Ended.');
    },
    null,
    true,
    'Asia/Kolkata'
  ).start();

  new CronJob(
    // run at 7:30:05 AM all day
    '5 30 7 * * *',
    function () {
      TimesheetCron.changeAcceptedPermission();
      console.log('All Accepted Permission goes to Edited'); //based on Admin permission
    },
    null,
    true,
    'Asia/Kolkata'
  ).start();

  new CronJob(
    // run at 11:59:50 PM all day
    '50 59 23 * * *',
    function () {
      TimesheetCron.createHolidayTimesheet();
      console.log('Creating Holiday sheet');
    },
    null,
    true,
    'Asia/Kolkata'
  ).start();

  new CronJob(
    // run at 12:10:00 AM all day
    '0 10 0 * * *',
    function () {
      TimesheetCron.createOfficalHolidayTimesheet();
      console.log('Creating Official Holiday sheet');
    },
    null,
    true,
    'Asia/Kolkata'
  ).start();

  // new CronJob(
  //   // run at 12:05:00 AM all day
  //   '0 5 0 * * *',
  //   function () {
  //     TimesheetCron.createLeave();
  //     console.log('Creating Leave sheet');
  //   },
  //   null,
  //   true,
  //   'Asia/Kolkata'
  // ).start();
};

module.exports = cronFunction;
