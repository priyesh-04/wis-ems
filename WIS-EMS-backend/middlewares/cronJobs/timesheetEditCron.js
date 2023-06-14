const Timesheet = require('../../models/timesheets/timesheets');

class TimesheetCron {
  async resetTimesheetEditPermission(req, res, next) {
    try {
      const result = await Timesheet.find({ is_editable: true });
      console.log(result);
      for (let i = 0; i < result.length; i++) {
        await Timesheet.findByIdAndUpdate(
          { _id: result[i]._id },
          { is_editable: false },
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
