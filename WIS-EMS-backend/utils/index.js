// export { default as CustomErrorhandler } from './CustomErrorHandler';
// export { default as JwtService } from './JwtService';

const JwtService = require('./JwtService');
const TokenService = require('./token');
const { CustomErrorhandler } = require('./CustomErrorHandler');

module.exports = { JwtService, TokenService, CustomErrorhandler };
