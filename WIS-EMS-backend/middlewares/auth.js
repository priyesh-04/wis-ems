const jwt = require('jsonwebtoken');

class ApiAuthValidator {
  validateAccessToken(req, res, next) {
    const bearerToken = req.headers.authorization;
    if (!bearerToken) {
      return res
        .status(401)
        .json({ status: false, message: 'Authorization Needed.' });
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
            req.decoded = decoded;
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
}

module.exports = new ApiAuthValidator();
