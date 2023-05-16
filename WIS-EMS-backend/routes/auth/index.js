const express = require('express');
const router = express.Router();
const { LoginController, UserTokenController } = require('../../controllers');
const { auth } = require('../../middlewares');
const multer = require('multer');
const upload = multer({ dest: './uploads/users/' });

router.post('/register', upload.single('image'), LoginController.register);
router.post('/login', LoginController.login);
router.post('/refreshtoken', UserTokenController.refresh);
router.post('/logout', LoginController.logout);
router.get('/profile/:id', LoginController.myProfile);
// router.post('/employee/create', auth, employeeController.createEmployee);
// router.post('/taskAsign', auth, taskAsignController.taskAsign);

module.exports = router;
