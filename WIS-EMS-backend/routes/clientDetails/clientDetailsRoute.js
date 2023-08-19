const express = require('express');
const router = express.Router();

const { ClientDetailsController } = require('../../controllers');
const { ApiAuthValidator } = require('../../middlewares');

router.post(
  '/',
  ApiAuthValidator.validateAccessToken,
  ApiAuthValidator.isLoggedInUser,
  ApiAuthValidator.authorizeRole('hr', 'admin'),
  ClientDetailsController.addClient
);

router.get(
  '/',
  ApiAuthValidator.validateAccessToken,
  ApiAuthValidator.isLoggedInUser,
  ApiAuthValidator.authorizeRole('hr', 'admin', 'employee', 'accountant'),
  ClientDetailsController.getAllClient
);

router.put(
  '/:id',
  ApiAuthValidator.validateAccessToken,
  ApiAuthValidator.isLoggedInUser,
  ApiAuthValidator.authorizeRole('hr', 'admin'),
  ClientDetailsController.updateClient
);

router.delete(
  '/:id',
  ApiAuthValidator.validateAccessToken,
  ApiAuthValidator.isLoggedInUser,
  ApiAuthValidator.authorizeRole('admin'),
  ClientDetailsController.deleteClient
);

router.get(
  '/all-task-by-client/:idc',
  ApiAuthValidator.validateAccessToken,
  ApiAuthValidator.isLoggedInUser,
  ApiAuthValidator.authorizeRole('admin'),
  ClientDetailsController.getAllTaskClientWise
);

module.exports = router;
