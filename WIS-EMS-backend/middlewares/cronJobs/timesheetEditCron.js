const { User } = require('../../models/auth/user');
const { Timesheets } = require('../../models/timesheets/timesheets');

class TimesheetCron {
  async resetTimesheetEditPermission(req, res, next) {
    try {
      const result = await Timesheets.find({
        $or: [{ edit_status: 'New' }],
      });
      console.log('New Change to Initial');
      for (let i = 0; i < result.length; i++) {
        await Timesheets.findByIdAndUpdate(
          { _id: result[i]._id },
          { edit_status: 'Initial' },
          { new: true }
        );
      }
    } catch (error) {
      console.log(error);
    }
  }

  async changeAcceptedPermission(req, res, next) {
    try {
      const result = await Timesheets.find({
        $or: [{ edit_status: 'Accepted' }],
      });
      console.log('Accepted Change to Edited');
      for (let i = 0; i < result.length; i++) {
        await Timesheets.findByIdAndUpdate(
          { _id: result[i]._id },
          { edit_status: 'Edited' },
          { new: true }
        );
      }
    } catch (error) {
      console.log(error);
    }
  }

  async createHolidayTimesheet(req, res, next) {
    try {
      const result = await User.find({
        role: { $ne: 'admin' },
        is_active: true,
      });
      console.log('Auto fillup holiday started');
      let date = new Date();
      let currentDay = date.getDay();

      const today =
        date.getFullYear() +
        '-' +
        (date.getMonth() > 8
          ? date.getMonth() + 1
          : '0' + (date.getMonth() + 1)) +
        '-' +
        (date.getDate() > 9 ? date.getDate() : '0' + date.getDate()) +
        'T00:00:00+05:30';

      let dayEnd =
        date.getFullYear() +
        '-' +
        (date.getMonth() > 8
          ? date.getMonth() + 1
          : '0' + (date.getMonth() + 1)) +
        '-' +
        (date.getDate() > 9 ? date.getDate() : '0' + date.getDate()) +
        'T23:59:59+05:30';
      // console.log(today, dayEnd);

      const checkAndCreate = async (user) => {
        let existTimesheet = await Timesheets.findOne({
          created_by: user._id,
          date: { $gte: today, $lte: dayEnd },
        });
        if (!existTimesheet) {
          let data = {
            in_time: null,
            out_time: null,
            edit_status: 'Initial',
            date: new Date(), /// have to check
            created_by: user._id,
            leave: false,
            is_holiday: true,
          };
          let newRequest = await Timesheets(data);
          newRequest.save();
          //   console.log('created one');
          // } else {
          //   console.log('not created');
        }
        // console.log(existTimesheet);

        return true;
      };

      for (let i = 0; i < result.length; i++) {
        if (result[i].holidays.some((el) => el == currentDay)) {
          await checkAndCreate(result[i]);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new TimesheetCron();
