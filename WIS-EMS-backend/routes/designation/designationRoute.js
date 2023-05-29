const express = require('express');
const router = express.Router();
const { DesignationController } = require('../../controllers');
const { ApiAuthValidator } = require('../../middlewares');

router.post(
  '/',
  ApiAuthValidator.validateAccessToken,
  DesignationController.addDesignation
);

router.get(
  '/',
  ApiAuthValidator.validateAccessToken,
  DesignationController.allDesignation
);
router.put(
  '/:id',
  ApiAuthValidator.validateAccessToken,
  DesignationController.editDesignation
);
router.delete(
  '/:id',
  ApiAuthValidator.validateAccessToken,
  DesignationController.deleteDesignation
);

module.exports = router;
