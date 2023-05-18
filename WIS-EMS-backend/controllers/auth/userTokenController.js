// import Joi from 'joi';
// import { RefreshToken, User } from '../../models';
const { RefreshTokenService } = require('../../services');

class RefreshTokenController {
  async refresh(req, res, next) {
    try {
      await RefreshTokenService.refresh(req, res, next);
    } catch (error) {
      return res.status(500).json({ status: false, message: 'Error ' + error });
    }
  }
}

module.exports = new RefreshTokenController();
