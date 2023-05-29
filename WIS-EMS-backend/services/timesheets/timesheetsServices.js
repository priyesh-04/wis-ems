const Timesheets = require('../../models/timesheets/timesheets');

class TimeSheetService {
  async addTimeSheet(req, res, next) {
    try {
      const payload = req.body;
      const newRequest = await Timesheets(payload);
      newRequest.save((err, result) => {
        if (err) {
          return res
            .status(400)
            .json({ msgErr: true, message: 'Error ' + err });
        } else {
          return res
            .status(201)
            .json({ msgErr: false, result, message: 'New Timesheet Created.' });
        }
      });
    } catch (error) {
      return res
        .status(500)
        .json({ msgErr: true, message: 'Internal Server Error ' + error });
    }
  }

  async updateTimesheet(req, res, next) {
    try {
      const payload = req.body;
      await Timesheets.findByIdAndUpdate(
        { _id: req.params.id },
        payload,
        (err, result) => {
          if (err) {
            return res
              .status(400)
              .json({ msgErr: true, message: 'Error ' + err });
          } else {
            return res.status(200).json({
              msgErr: false,
              message: 'Timesheet Update succesfully.',
            });
          }
        }
      );
    } catch (error) {
      return res
        .status(500)
        .json({ msgErr: true, message: 'Internal Server Error ' + error });
    }
  }

  async getAllTimesheetByUser(req, res, next) {
    try {
      await Timesheets.find({ created_by: req.params.id }, (err, result) => {
        if (err) {
          return res
            .status(400)
            .json({ msgErr: true, message: 'Error ' + err });
        } else if (result.length === 0) {
          return res
            .status(200)
            .json({ msgErr: false, message: 'Timesheet not Found !!' });
        } else {
          return res.status(200).json({
            msgErr: false,
            result,
          });
        }
      });
    } catch (error) {
      return res
        .status(500)
        .json({ msgErr: true, message: 'Internal Server Error ' + error });
    }
  }
}

module.exports = new TimeSheetService();
