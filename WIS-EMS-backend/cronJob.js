const cron = require('node-cron');
const { TimesheetCron } = require('./middlewares/cronJobs');

const cronFunction = () => {
  console.log('Cron Job Started.');
  cron.schedule(
    '0 0 12 * * *',
    () => {
      TimesheetCron.resetTimesheetEditPermission();
      console.log('All Timesheet edit permission Ended.');
    },
    {
      scheduled: true,
      timezone: 'Asia/Kolkata',
    }
  );

  cron.schedule(
    '0 0 12 * * *',
    () => {
      TimesheetCron.changeAcceptedPermission();
      console.log('All Accepted Permission goes to Edited');
    },
    {
      scheduled: true,
      timezone: 'Asia/Kolkata',
    }
  );

  cron.schedule(
    '0 0 12 * * *',
    () => {
      TimesheetCron.createHolidayTimesheet();
      console.log('Creating Holiday sheet');
    },
    {
      scheduled: true,
      timezone: 'Asia/Kolkata',
    }
  );
};

module.exports = cronFunction;
