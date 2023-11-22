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
router.post(
  '/reset-password',
  ApiAuthValidator.validateAccessToken,
  UserController.resetPassword
);

router.post(
  '/forgot-password-email-send',
  UserController.forgotPasswordEmailSend
);

router.post('/change-password/:userId/:token', UserController.changePassword);

router.get(
  '/my-profile',
  ApiAuthValidator.validateAccessToken,
  ApiAuthValidator.isLoggedInUser,
  LoginController.myProfile
);
router.put(
  '/user/:id',
  ApiAuthValidator.validateAccessToken,
  ApiAuthValidator.isLoggedInUser,
  ApiAuthValidator.authorizeRole('admin', 'hr'),
  upload.single('image'),
  LoginController.updateUser
);

router.get(
  '/user/all-admin',
  ApiAuthValidator.validateAccessToken,
  ApiAuthValidator.isLoggedInUser,
  ApiAuthValidator.authorizeRole('admin', 'hr'),
  UserController.getAllAdmin
);
router.get(
  '/user/all-employee',
  ApiAuthValidator.validateAccessToken,
  ApiAuthValidator.isLoggedInUser,
  ApiAuthValidator.authorizeRole('admin', 'hr'),
  UserController.getAllEmployee
);
router.get(
  '/user/all-hr',
  ApiAuthValidator.validateAccessToken,
  ApiAuthValidator.isLoggedInUser,
  ApiAuthValidator.authorizeRole('admin', 'hr'),
  UserController.getAllHR
);

router.post(
  '/user/active-deactive/:id',
  ApiAuthValidator.validateAccessToken,
  ApiAuthValidator.isLoggedInUser,
  ApiAuthValidator.authorizeRole('admin'),
  UserController.userActiveDeactive
);

router.get(
  '/user/user-spend-time',
  ApiAuthValidator.validateAccessToken,
  ApiAuthValidator.isLoggedInUser,
  ApiAuthValidator.authorizeRole('admin'),
  UserController.usetListWithSpendTime
);

router.post(
  '/password-reset-resend-email/user/:uid',
  ApiAuthValidator.validateAccessToken,
  ApiAuthValidator.isLoggedInUser,
  ApiAuthValidator.authorizeRole('admin'),
  UserController.passwordResendEmail
);

router.get(
  '/user/all-third-party-user',
  ApiAuthValidator.validateAccessToken,
  ApiAuthValidator.isLoggedInUser,
  UserController.getAllUserThirdParty
);


//////////////////////////////
router.get(
  '/user/all-employee-without-pagination',
  ApiAuthValidator.validateAccessToken,
  ApiAuthValidator.isLoggedInUser,
  ApiAuthValidator.authorizeRole('admin', 'hr'),
  UserController.getAllEmployeeWithoutPagination
);

router.get(
  '/user/user-spend-time-without-pagination',
  ApiAuthValidator.validateAccessToken,
  ApiAuthValidator.isLoggedInUser,
  ApiAuthValidator.authorizeRole('admin'),
  UserController.usetListWithSpendTimeWithoutPagination
);
module.exports = router;
