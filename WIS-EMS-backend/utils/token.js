const UserToken = require('../models/auth/userToken');
const jwt = require('jsonwebtoken');

class TokenService {
  async generateToken(user) {
    try {
      const payload = { _id: user._id, role: user.role };
      const accessToken = jwt.sign(
        payload,
        process.env.JWT_ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.JWT_ACCESS_TOKEN_LIFE }
      );
      const refreshToken = jwt.sign(
        payload,
        process.env.JWT_REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.JWT_REFRESH_TOKEN_LIFE }
      );

      const userToken = await UserToken.findOne({ user_id: user._id });
      if (userToken) await UserToken.findOneAndRemove({ user_id: user._id });

      await new UserToken({ user_id: user._id, token: refreshToken }).save();
      return Promise.resolve({ accessToken, refreshToken });
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async verifyToken(refreshToken) {
    const privateKey = process.env.JWT_REFRESH_TOKEN_SECRET;

    return new Promise((resolve, reject) => {
      UserToken.findOne({ token: refreshToken }, (err, doc) => {
        if (!doc)
          return reject({ error: true, message: 'Invalid refresh token' });

        jwt.verify(refreshToken, privateKey, (err, tokenDetails) => {
          if (err)
            return reject({ error: true, message: 'Invalid refresh token' });
          resolve({
            tokenDetails,
            error: false,
            message: 'Valid refresh token',
          });
        });
      });
    });
  }
}

module.exports = new TokenService();
