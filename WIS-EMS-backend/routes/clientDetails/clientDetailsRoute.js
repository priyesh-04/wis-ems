const express = require('express');
const router = express.Router();

const { ClientDetailsController } = require('../../controllers');
const { ApiAuthValidator } = require('../../middlewares');

router.post(
  '/',
  ApiAuthValidator.validateAccessToken,
  ApiAuthValidator.authorizeRole('hr', 'admin'),
  ClientDetailsController.addClient
);

router.get(
  '/',
  ApiAuthValidator.validateAccessToken,
  ApiAuthValidator.authorizeRole('hr', 'admin'),
  ClientDetailsController.getAllClient
);

router.put(
  '/:id',
  ApiAuthValidator.validateAccessToken,
  ApiAuthValidator.authorizeRole('hr', 'admin'),
  ClientDetailsController.updateClient
);

router.delete(
  '/:id',
  ApiAuthValidator.validateAccessToken,
  ApiAuthValidator.authorizeRole('admin'),
  ClientDetailsController.deleteClient
);

module.exports = router;
