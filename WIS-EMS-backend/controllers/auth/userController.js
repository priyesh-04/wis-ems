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

  async userActiveDeactive(req, res, next) {
    try {
      await AuthService.userActiveDeactive(req, res, next);
    } catch (error) {
      return res.status(500).json({ status: false, message: 'Error ' + error });
    }
  }

  async usetListWithSpendTime(req, res, next) {
    try {
      await AuthService.usetListWithSpendTime(req, res, next);
    } catch (error) {
      return res.status(500).json({ status: false, message: 'Error ' + error });
    }
  }

  async resetPassword(req, res, next) {
    try {
      await AuthService.resetPassword(req, res, next);
    } catch (error) {
      return res.status(500).json({ status: false, message: 'Error ' + error });
    }
  }

  async forgotPasswordEmailSend(req, res, next) {
    try {
      await AuthService.forgotPasswordEmailSend(req, res, next);
    } catch (error) {
      return res.status(500).json({ status: false, message: 'Error ' + error });
    }
  }

  async changePassword(req, res, next) {
    try {
      await AuthService.changePassword(req, res, next);
    } catch (error) {
      return res.status(500).json({ status: false, message: 'Error ' + error });
    }
  }

  async passwordResendEmail(req, res, next) {
    try {
      await AuthService.passwordResendEmail(req, res, next);
    } catch (error) {
      return res.status(500).json({ status: false, message: 'Error ' + error });
    }
  }

  async getAllUserThirdParty(req, res, next) {
    try {
      await AuthService.getAllUserThirdParty(req, res, next);
    } catch (error) {
      return res.status(500).json({ status: false, message: 'Error ' + error });
    }
  }


  //////////////////////////////////////////
  async getAllEmployeeWithoutPagination(req, res, next) {
    try {
      await AuthService.getAllEmployeeWithoutPagination(req, res, next);
    } catch (error) {
      return res.status(500).json({ status: false, message: 'Error ' + error });
    }
  }

  async usetListWithSpendTimeWithoutPagination(req, res, next) {
    try {
      await AuthService.usetListWithSpendTimeWithoutPagination(req, res, next);
    } catch (error) {
      return res.status(500).json({ status: false, message: 'Error ' + error });
    }
  }
}

module.exports = new UserController();
