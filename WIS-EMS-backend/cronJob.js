const CronJob = require('cron').CronJob;
const { TimesheetCron } = require('./middlewares/cronJobs');

const cronFunction = () => {
  console.log('Cron Job Started.');

  new CronJob(
    '0 30 7 * * *',
    function () {
      TimesheetCron.resetTimesheetEditPermission();
      console.log('All Timesheet edit permission Ended.');
    },
    null,
    true,
    'Asia/Kolkata'
  ).start();

  new CronJob(
    '5 30 7 * * *',
    function () {
      TimesheetCron.changeAcceptedPermission();
      console.log('All Accepted Permission goes to Edited');
    },
    null,
    true,
    'Asia/Kolkata'
  ).start();

  new CronJob(
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
    '0 10 0 * * *',
    function () {
      TimesheetCron.createOfficalHolidayTimesheet();
      console.log('Creating Official Holiday sheet');
    },
    null,
    true,
    'Asia/Kolkata'
  ).start();
};

module.exports = cronFunction;
