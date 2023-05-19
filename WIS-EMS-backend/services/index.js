const AuthService = require('./auth/authService');
const RefreshTokenService = require('./auth/UserTokenService');
const ClientDetailsService = require('./clientDetails/clientDetailsService');
const DesignationService = require('./designation/designationService');

module.exports = {
  AuthService,
  RefreshTokenService,
  ClientDetailsService,
  DesignationService,
};
