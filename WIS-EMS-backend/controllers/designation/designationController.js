const { DesignationService } = require('../../services');

class DesignationController {
  async addDesignation(req, res, next) {
    try {
      await DesignationService.addDesignation(req, res, next);
    } catch (error) {
      return res
        .staus(500)
        .json({ msgError: true, message: 'The Error is : ' + error });
    }
  }

  async editDesignation(req, res, next) {
    try {
      await DesignationService.editDesignation(req, res, next);
    } catch (error) {
      return res
        .staus(500)
        .json({ msgError: true, message: 'The Error is : ' + error });
    }
  }

  async allDesignation(req, res, next) {
    try {
      await DesignationService.allDesignation(req, res, next);
    } catch (error) {
      return res
        .staus(500)
        .json({ msgError: true, message: 'The Error is : ' + error });
    }
  }

  async deleteDesignation(req, res, next) {
    try {
      await DesignationService.deleteDesignation(req, res, next);
    } catch (error) {
      return res
        .staus(500)
        .json({ msgError: true, message: 'The Error is : ' + error });
    }
  }
}

module.exports = new DesignationController();
