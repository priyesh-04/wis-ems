const cron = require('node-cron');
const { TimesheetCron } = require('./middlewares/cronJobs');

const cronFunction = () => {
  cron.schedule(
    '0 0 */1 * * *',
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
    '0 0 */1 * * *',
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
    '*/30 * * * * *',
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
