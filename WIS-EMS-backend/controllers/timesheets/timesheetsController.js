const { TimeSheetService } = require('../../services');

class TimeSheetController {
  async addTimeSheet(req, res, next) {
    try {
      await TimeSheetService.addTimeSheet(req, res, next);
    } catch (error) {
      return res.status(500).json({ status: false, message: 'Error ' + error });
    }
  }

  async updateTimesheet(req, res, next) {
    try {
      await TimeSheetService.updateTimesheet(req, res, next);
    } catch (error) {
      return res.status(500).json({ status: false, message: 'Error ' + error });
    }
  }

  async getAllTimesheetByUser(req, res, next) {
    try {
      await TimeSheetService.getAllTimesheetByUser(req, res, next);
    } catch (error) {
      return res.status(500).json({ status: false, message: 'Error ' + error });
    }
  }

  // async addTimeSheet(req, res, next) {
  //   try {
  //     await TimeSheetService.addTimeSheet(req, res, next);
  //   } catch (error) {
  //     return res.status(500).json({ status: false, message: 'Error ' + error });
  //   }
  // }
}

module.exports = new TimeSheetController();
