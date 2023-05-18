const LoginController = require('./auth/loginController');
const UserTokenController = require('./auth/userTokenController');
const UserController = require('./auth/userController');
const ClientDetailsController = require('./clientDetails/clientDetailsController');

module.exports = {
  LoginController,
  UserTokenController,
  UserController,
  ClientDetailsController,
};

// export { default as userController } from './auth/userController';

// export { default as employeeController } from './employee/employeeController';

// export { default as taskAsignController } from './task/taskAsignController';
