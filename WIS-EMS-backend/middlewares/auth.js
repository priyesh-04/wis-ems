const jwt = require('jsonwebtoken');
const UserToken = require('../models/auth/userToken');

class ApiAuthValidator {
  validateAccessToken(req, res, next) {
    const bearerToken = req.headers.authorization;
    if (!bearerToken) {
      return res
        .status(401)
        .json({ status: false, message: 'Unauthorized. Please Add Token.' });
    }
    const token = bearerToken.split(' ')[1];
    if (token) {
      jwt.verify(
        token,
        process.env.JWT_ACCESS_TOKEN_SECRET,
        function (err, decoded) {
          if (err) {
            return res
              .status(401)
              .json({ status: false, message: 'Access Token Expired' });
          } else {
            // console.log(decoded);
            req.user = decoded;
            next();
          }
        }
      );
    } else {
      return res
        .status(403)
        .send({ status: false, message: 'Access Token Required' });
    }
  }

  authorizeRole(...roles) {
    return (req, res, next) => {
      const bearerToken = req.headers.authorization;
      if (!bearerToken) {
        return res
          .status(401)
          .json({ status: false, message: 'Unauthorized. Please Add Token.' });
      }
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          message: `Role: ${req.user.role} is not allowed to access this resource`,
        });
      }
      //admin
      next();
    };
  }
}

module.exports = new ApiAuthValidator();
