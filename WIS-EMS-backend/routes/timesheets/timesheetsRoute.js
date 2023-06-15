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

router.post(
  '/active-deactive/:id',
  ApiAuthValidator.validateAccessToken,
  ApiAuthValidator.authorizeRole('admin'),
  TimeSheetController.timesheetEditable
);

router.put(
  '/single-task/:id',
  ApiAuthValidator.validateAccessToken,
  TimeSheetController.updateSingleTaskDetails
);

router.post(
  '/single-task/:id',
  ApiAuthValidator.validateAccessToken,
  TimeSheetController.addTaskSingle
);

router.delete(
  '/single-task/:id/:taskDetailsId',
  ApiAuthValidator.validateAccessToken,
  ApiAuthValidator.authorizeRole('hr', 'admin', 'employee', 'accountant'),
  TimeSheetController.deleteSingleTaskDetails
);

router.get(
  '/get-all-editable-sheet',
  ApiAuthValidator.validateAccessToken,
  ApiAuthValidator.authorizeRole('admin'),
  TimeSheetController.getAllEditableTimesheet
);

module.exports = router;
