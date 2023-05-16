const TokenService = require('../../utils/token');
const jwt = require('jsonwebtoken');

class UserTokenService {
  async refresh(req, res, next) {
    try {
      const payload = req.body;
      await TokenService.verifyToken(payload.refreshToken)
        .then(({ tokenDetails }) => {
          const payload = { _id: tokenDetails._id, roles: tokenDetails.roles };
          const accessToken = jwt.sign(
            payload,
            process.env.JWT_ACCESS_TOKEN_SECRET,
            { expiresIn: process.env.JWT_ACCESS_TOKEN_LIFE }
          );
          return res.status(200).json({
            error: false,
            accessToken,
            message: 'Access token created successfully',
          });
        })
        .catch((err) => {
          return res.status(400).json({ message: 'Error ' + err });
        });
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Internal Server Error ' + error });
    }
  }
}

module.exports = new UserTokenService();
