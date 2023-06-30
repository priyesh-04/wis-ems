const jwt = require('jsonwebtoken');
const { UserToken } = require('../models/auth/userToken');

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
          .json({ msgErr: true, message: 'Unauthorized. Please Add Token.' });
      }
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          msgErr: true,
          message: `Role: ${req.user.role} is not allowed to access this resource`,
        });
      }
      //admin
      next();
    };
  }

  hierarchicalAccess(uptoAccess) {
    return (req, res, next) => {
      console.log(uptoAccess);
      const userRole = req.user.role;
      if (!userRole) {
        return res.status(401).json({ message: 'Unauthorized !!!' });
      }
      if (uptoAccess === 'admin' && userRole === 'admin') {
        next();
      } else if (
        uptoAccess === 'hr' &&
        (userRole === 'admin' || userRole === 'hr')
      ) {
        next();
      } else {
        return res.status(403).json({
          msgErr: true,
          message: `Role: ${userRole} is not allowed to access this resource.`,
        });
      }
    };
  }

  async isLoggedInUser(req, res, next) {
    const bearerToken = req.headers.authorization;
    if (!bearerToken) {
      return res
        .status(401)
        .json({ msgErr: true, message: 'Unauthorized. Please Add Token.' });
    }
    if (!req?.user?.role) {
      return res
        .status(403)
        .json({ msgErr: true, message: `Please Logged In to view resources` });
    }
    let loggedinUser = await UserToken.findOne({ user_id: req.user._id });
    if (!loggedinUser) {
      return res
        .status(403)
        .json({ msgErr: true, message: `Please Logged In to view resources` });
    }

    //admin
    next();
  }
}

module.exports = new ApiAuthValidator();
