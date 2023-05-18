const express = require('express');
const router = express.Router();

const { ClientDetailsController } = require('../../controllers');
const { ApiAuthValidator } = require('../../middlewares');

router.post(
  '/',
  ApiAuthValidator.validateAccessToken,
  ClientDetailsController.addClient
);

router.get(
  '/',
  ApiAuthValidator.validateAccessToken,
  // ApiAuthValidator.authorizeRole('hr', 'admin'),
  ClientDetailsController.getAllClient
);

router.put(
  '/:id',
  ApiAuthValidator.validateAccessToken,
  ClientDetailsController.updateClient
);

router.delete(
  '/:id',
  ApiAuthValidator.validateAccessToken,
  ClientDetailsController.deleteClient
);

module.exports = router;
