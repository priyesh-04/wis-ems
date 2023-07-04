const { OfficeHolidaysService } = require('../../services');

class OfficeHolidaysController {
  async createHolidays(req, res, next) {
    try {
      await OfficeHolidaysService.createHolidays(req, res, next);
    } catch (error) {
      return res.status(500).json({ msgErr: true, message: 'Error ' + error });
    }
  }

  async updateHolidays(req, res, next) {
    try {
      await OfficeHolidaysService.updateHolidays(req, res, next);
    } catch (error) {
      return res.status(500).json({ msgErr: true, message: 'Error ' + error });
    }
  }

  async deleteHolidays(req, res, next) {
    try {
      await OfficeHolidaysService.deleteHolidays(req, res, next);
    } catch (error) {
      return res.status(500).json({ msgErr: true, message: 'Error ' + error });
    }
  }

  async getCurrentYrHoliday(req, res, next) {
    try {
      await OfficeHolidaysService.getCurrentYrHoliday(req, res, next);
    } catch (error) {
      return res.status(500).json({ msgErr: true, message: 'Error ' + error });
    }
  }
}

module.exports = new OfficeHolidaysController();
