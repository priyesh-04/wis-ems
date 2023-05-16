const { AuthService } = require('../../services');

class LoginController {
  async login(req, res, next) {
    try {
      await AuthService.login(req, res, next);
    } catch (error) {
      return res.status(500).json({ status: false, message: 'Error' });
    }
  }

  async register(req, res, next) {
    try {
      await AuthService.register(req, res, next);
    } catch (error) {
      return res.status(500).json({ status: false, message: 'Error' });
    }
  }

  async logout(req, res, next) {
    try {
      await AuthService.logout(req, res, next);
    } catch (error) {
      return res.status(500).json({ status: false, message: 'Error' });
    }
  }

  async myProfile(req, res, next) {
    try {
      await AuthService.myProfile(req, res, next);
    } catch (error) {
      return res.status(500).json({ status: false, message: 'Error' });
    }
  }

  async updateUser(req, res, next) {
    try {
      await AuthService.updateUser(req, res, next);
    } catch (error) {
      return res.status(500).json({ status: false, message: 'Error' });
    }
  }
}

module.exports = new LoginController();
