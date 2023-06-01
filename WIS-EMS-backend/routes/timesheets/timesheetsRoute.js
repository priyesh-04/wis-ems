const express = require('express');
const router = express.Router();

const { TimeSheetController } = require('../../controllers');
const { ApiAuthValidator } = require('../../middlewares');

router.post(
  '/',
  ApiAuthValidator.validateAccessToken,
  TimeSheetController.addTimeSheet
);

router.put(
  '/:id',
  ApiAuthValidator.validateAccessToken,
  TimeSheetController.updateTimesheet
);

router.get(
  '/user/:id',
  ApiAuthValidator.validateAccessToken,
  TimeSheetController.getAllTimesheetByUser
);

router.get(
  '/task-details/user/:id',
  ApiAuthValidator.validateAccessToken,
  TimeSheetController.taskdetailsByUserDateWise
);

module.exports = router;
