const express = require('express');
const router = express.Router();
const { DesignationController } = require('../../controllers');
const { ApiAuthValidator } = require('../../middlewares');

router.post(
  '/',
  ApiAuthValidator.validateAccessToken,
  ApiAuthValidator.isLoggedInUser,
  ApiAuthValidator.authorizeRole('hr', 'admin'),
  DesignationController.addDesignation
);

router.get(
  '/',
  ApiAuthValidator.validateAccessToken,
  ApiAuthValidator.isLoggedInUser,
  ApiAuthValidator.authorizeRole('hr', 'admin'),
  DesignationController.allDesignation
);
router.put(
  '/:id',
  ApiAuthValidator.validateAccessToken,
  ApiAuthValidator.isLoggedInUser,
  ApiAuthValidator.authorizeRole('hr', 'admin'),
  DesignationController.editDesignation
);
router.delete(
  '/:id',
  ApiAuthValidator.validateAccessToken,
  ApiAuthValidator.isLoggedInUser,
  ApiAuthValidator.authorizeRole('admin'),
  DesignationController.deleteDesignation
);

module.exports = router;
