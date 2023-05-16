// import Joi from 'joi';
// import { REFRESH_SECRET } from '../../config';
// import { RefreshToken, User } from '../../models';
// import { CustomErrorhandler, JwtService } from '../../utils';
const { RefreshTokenService } = require('../../services');

class RefreshTokenController {
  async refresh(req, res, next) {
    try {
      await RefreshTokenService.refresh(req, res, next);
    } catch (error) {
      return res.status(500).json({ status: false, message: 'Error' });
    }
  }
}

module.exports = new RefreshTokenController();
