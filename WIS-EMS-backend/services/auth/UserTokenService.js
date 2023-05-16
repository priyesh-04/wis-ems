const RefreshToken = require('../../models/auth/userToken');
const User = require('../../models/auth/user');
const { CustomErrorhandler } = require('../../utils');
const TokenService = require('../../utils/token');
const jwt = require('jsonwebtoken');

class UserTokenService {
  async refresh(req, res, next) {
    try {
      const payload = req.body;
      await TokenService.verifyToken(payload.refreshToken)
        .then(({ tokenDetails }) => {
          // console.log(tokenDetails, 'TokenDetails');
          const payload = { _id: tokenDetails._id, roles: tokenDetails.roles };
          const accessToken = jwt.sign(
            payload,
            process.env.ACCESS_TOKEN_PRIVATE_KEY,
            { expiresIn: '14m' }
          );
          return res.status(200).json({
            error: false,
            accessToken,
            message: 'Access token created successfully',
          });
        })
        .catch((err) => res.status(400).json(err));

      // Token
      // const access_token = JwtService.sign({ _id: user._id, role: user.role });
      // const refresh_token = JwtService.sign(
      //   { _id: user._id, role: user.role },
      //   '1y',
      //   REFRESH_SECRET
      // );

      // // Database whitelist
      // await RefreshToken.create({ token: refresh_token });

      // res.json({ access_token, refresh_token });
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Internal Server Error ' + error });
    }
  }
}

module.exports = new UserTokenService();
