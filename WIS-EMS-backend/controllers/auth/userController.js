const { AuthService } = require('../../services');

class UserController {
  async getAllAdmin(req, res, next) {
    try {
      await AuthService.getAllAdmin(req, res, next);
    } catch (error) {
      return res.status(500).json({ status: false, message: 'Error ' + error });
    }
  }
  async getAllEmployee(req, res, next) {
    try {
      await AuthService.getAllEmployee(req, res, next);
    } catch (error) {
      return res.status(500).json({ status: false, message: 'Error ' + error });
    }
  }
  async getAllHR(req, res, next) {
    try {
      await AuthService.getAllHR(req, res, next);
    } catch (error) {
      return res.status(500).json({ status: false, message: 'Error ' + error });
    }
  }
}

module.exports = new UserController();
