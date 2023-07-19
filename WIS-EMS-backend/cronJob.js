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

  // job.start();
  // reset timesheet permission
  // cron.schedule(
  //   '0 30 7 * * *',
  //   () => {
  //     TimesheetCron.resetTimesheetEditPermission();
  //     console.log('All Timesheet edit permission Ended.');
  //   },
  //   {
  //     scheduled: true,
  //     timezone: 'Asia/Kolkata',
  //   }
  // );
  // //once edited -> edited status
  // // end of the day
  // cron.schedule(
  //   '5 30 7 * * *',
  //   () => {
  //     TimesheetCron.changeAcceptedPermission();
  //     console.log('All Accepted Permission goes to Edited');
  //   },
  //   {
  //     scheduled: true,
  //     timezone: 'Asia/Kolkata',
  //   }
  // );
  // // holiday or not submission created
  // // run end of the day
  // cron.schedule(
  //   '50 59 23 * * *',
  //   () => {
  //     TimesheetCron.createHolidayTimesheet();
  //     console.log('Creating Holiday sheet');
  //   },
  //   {
  //     scheduled: true,
  //     timezone: 'Asia/Kolkata',
  //   }
  // );
  // // create official holidays
  // // run start at start of the day
  // // run at 0 10 0 * * *
  // cron.schedule(
  //   '0 10 0 * * *',
  //   () => {
  //     TimesheetCron.createOfficalHolidayTimesheet();
  //     console.log('Creating Official Holiday sheet');
  //   },
  //   {
  //     scheduled: true,
  //     timezone: 'Asia/Kolkata',
  //   }
  // );
};

module.exports = cronFunction;
