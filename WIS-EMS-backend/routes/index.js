const express = require('express');
const router = express.Router();
const authRoute = require('./auth');

// multiple module route add here
router.use('/', authRoute);

router.get('/', (req, res) => {
  return res.status(200).json({ message: 'Welcome to WIS-EMS api.' });
});

module.exports = router;
