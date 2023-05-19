const LoginController = require('./auth/loginController');
const UserTokenController = require('./auth/userTokenController');
const UserController = require('./auth/userController');
const ClientDetailsController = require('./clientDetails/clientDetailsController');
const DesignationController = require('./designation/designationController');

module.exports = {
  LoginController,
  UserTokenController,
  UserController,
  ClientDetailsController,
  DesignationController,
};

// export { default as userController } from './auth/userController';

// export { default as employeeController } from './employee/employeeController';

// export { default as taskAsignController } from './task/taskAsignController';
