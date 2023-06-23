const Timesheet = require('../../models/timesheets/timesheets');

class TimesheetCron {
  async resetTimesheetEditPermission(req, res, next) {
    try {
      const result = await Timesheet.find({
        $or: [{ edit_status: 'New' }, { edit_status: 'Requested' }],
      });
      console.log(result);
      for (let i = 0; i < result.length; i++) {
        await Timesheet.findByIdAndUpdate(
          { _id: result[i]._id },
          { edit_status: 'Saved' },
          { new: true }
          // (err, done) => {
          //   if (err) {
          //     console.log(err);
          //   } else {
          //     console.log(done);
          //   }
          // }
        );
      }
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new TimesheetCron();
