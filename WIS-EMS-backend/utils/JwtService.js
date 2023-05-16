const jwt = require('jsonwebtoken');

class JwtService {
  async sign(payload, expiry = '3600s', secret = process.env.JWT_SECRET) {
    return jwt.sign(payload, secret, { expiresIn: expiry });
  }

  async verify(token, secret = process.env.JWT_SECRET) {
    return jwt.verify(token, secret);
  }
}

module.exports = new JwtService();
