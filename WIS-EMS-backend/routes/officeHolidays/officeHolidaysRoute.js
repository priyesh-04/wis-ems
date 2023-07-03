const express = require('express');
const router = express.Router();

const { OfficeHolidaysController } = require('../../controllers');
const { ApiAuthValidator } = require('../../middlewares');

router.post(
  '/',
  ApiAuthValidator.validateAccessToken,
  ApiAuthValidator.isLoggedInUser,
  OfficeHolidaysController.createHolidays
);

router.put(
  '/:hid',
  ApiAuthValidator.validateAccessToken,
  ApiAuthValidator.isLoggedInUser,
  OfficeHolidaysController.updateHolidays
);

router.delete(
  '/:hid',
  ApiAuthValidator.validateAccessToken,
  ApiAuthValidator.isLoggedInUser,
  OfficeHolidaysController.deleteHolidays
);

router.get(
  '/',
  ApiAuthValidator.validateAccessToken,
  ApiAuthValidator.isLoggedInUser,
  OfficeHolidaysController.getCurrentYrHoliday
);

module.exports = router;
