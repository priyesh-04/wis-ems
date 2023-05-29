const { AuthService } = require('../../services');

class LoginController {
  async login(req, res, next) {
    try {
      await AuthService.login(req, res, next);
    } catch (error) {
      return res.status(500).json({ status: false, message: 'Error ' + error });
    }
  }

  async createUser(req, res, next) {
    try {
      await AuthService.createUser(req, res, next);
    } catch (error) {
      return res.status(500).json({ status: false, message: 'Error ' + error });
    }
  }

  async logout(req, res, next) {
    try {
      await AuthService.logout(req, res, next);
    } catch (error) {
      return res.status(500).json({ status: false, message: 'Error ' + error });
    }
  }

  async myProfile(req, res, next) {
    try {
      await AuthService.myProfile(req, res, next);
    } catch (error) {
      return res.status(500).json({ status: false, message: 'Error ' + error });
    }
  }

  async updateUser(req, res, next) {
    try {
      await AuthService.updateUser(req, res, next);
    } catch (error) {
      return res.status(500).json({ status: false, message: 'Error ' + error });
    }
  }
}

module.exports = new LoginController();
