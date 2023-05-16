const express = require('express');
const router = express.Router();
const { LoginController, UserTokenController } = require('../../controllers');
const { ApiAuthValidator } = require('../../middlewares');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/register', upload.single('image'), LoginController.register);
router.post('/login', LoginController.login);
router.post('/refreshtoken', UserTokenController.refresh);
router.post('/logout', LoginController.logout);
router.get(
  '/profile/:id',
  ApiAuthValidator.validateAccessToken,
  LoginController.myProfile
);
router.post(
  '/user/:id',
  ApiAuthValidator.validateAccessToken,
  upload.single('image'),
  LoginController.updateUser
);
// router.post('/employee/create', auth, employeeController.createEmployee);
// router.post('/taskAsign', auth, taskAsignController.taskAsign);

module.exports = router;
