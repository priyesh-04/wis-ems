const AuthService = require('./auth/authService');
const RefreshTokenService = require('./auth/UserTokenService');
const ClientDetailsService = require('./clientDetails/clientDetailsService');
const DesignationService = require('./designation/designationService');
const TimeSheetService = require('./timesheets/timesheetsServices');
const OfficeHolidaysService = require('./officeHolidays/officeHolidaysService');

module.exports = {
  AuthService,
  RefreshTokenService,
  ClientDetailsService,
  DesignationService,
  TimeSheetService,
  OfficeHolidaysService,
};
