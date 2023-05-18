const { AuthService } = require('../../services');

class UserController {
  async getAllAdmin(req, res, next) {
    try {
      await AuthService.getAllAdmin(req, res, next);
    } catch (error) {
      return res.status(500).json({ status: false, message: 'Error ' + error });
    }
  }
}

module.exports = new UserController();
