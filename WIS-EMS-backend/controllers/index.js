const LoginController = require('./auth/loginController');
const UserTokenController = require('./auth/userTokenController');
const UserController = require('./auth/userController');
const ClientDetailsController = require('./clientDetails/clientDetailsController');
const DesignationController = require('./designation/designationController');
const TimeSheetController = require('./timesheets/timesheetsController');
const OfficeHolidaysController = require('./officeHolidays/officeHolidaysController');

module.exports = {
  LoginController,
  UserTokenController,
  UserController,
  ClientDetailsController,
  DesignationController,
  TimeSheetController,
  OfficeHolidaysController,
};
