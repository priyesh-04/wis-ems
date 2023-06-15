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

  async updateSingleTaskDetails(req, res, next) {
    try {
      await TimeSheetService.updateSingleTaskDetails(req, res, next);
    } catch (error) {
      return res.status(500).json({ status: false, message: 'Error ' + error });
    }
  }

  async addTaskSingle(req, res, next) {
    try {
      await TimeSheetService.addTaskSingle(req, res, next);
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

  async taskdetailsByUserDateWise(req, res, next) {
    try {
      await TimeSheetService.taskdetailsByUserDateWise(req, res, next);
    } catch (error) {
      return res.status(500).json({ status: false, message: 'Error ' + error });
    }
  }

  async timesheetEditable(req, res, next) {
    try {
      await TimeSheetService.timesheetEditable(req, res, next);
    } catch (error) {
      return res.status(500).json({ status: false, message: 'Error ' + error });
    }
  }
}

module.exports = new TimeSheetController();
