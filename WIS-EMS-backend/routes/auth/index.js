const express = require('express');
const router = express.Router();
const {
  LoginController,
  UserTokenController,
  UserController,
} = require('../../controllers');
const { ApiAuthValidator } = require('../../middlewares');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post(
  '/create-user',
  upload.single('image'),
  ApiAuthValidator.validateAccessToken,
  ApiAuthValidator.authorizeRole('admin', 'hr'),
  LoginController.createUser
);
router.post('/login', LoginController.login);
router.post('/refreshtoken', UserTokenController.refresh);
router.post('/logout/:id', LoginController.logout);
router.get(
  '/my-profile',
  ApiAuthValidator.validateAccessToken,
  ApiAuthValidator.authorizeRole('admin', 'hr', 'employee', 'accountant'),
  LoginController.myProfile
);
router.put(
  '/user/:id',
  ApiAuthValidator.validateAccessToken,
  ApiAuthValidator.authorizeRole('admin', 'hr'),
  upload.single('image'),
  LoginController.updateUser
);

router.get(
  '/user/all-admin',
  ApiAuthValidator.validateAccessToken,
  ApiAuthValidator.authorizeRole('admin', 'hr'),
  UserController.getAllAdmin
);
router.get(
  '/user/all-employee',
  ApiAuthValidator.validateAccessToken,
  ApiAuthValidator.authorizeRole('admin', 'hr'),
  UserController.getAllEmployee
);
router.get(
  '/user/all-hr',
  ApiAuthValidator.validateAccessToken,
  ApiAuthValidator.authorizeRole('admin', 'hr'),
  UserController.getAllHR
);

router.post(
  '/user/active-deactive/:id',
  ApiAuthValidator.validateAccessToken,
  ApiAuthValidator.authorizeRole('admin'),
  UserController.userActiveDeactive
);

router.get(
  '/user/user-spend-time',
  ApiAuthValidator.validateAccessToken,
  ApiAuthValidator.authorizeRole('admin'),
  UserController.usetListWithSpendTime
);

module.exports = router;
