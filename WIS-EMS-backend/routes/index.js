const express = require('express');
const router = express.Router();
const authRoute = require('./auth');
const clientDetailsRoute = require('./clientDetails/clientDetailsRoute');
const designationRoute = require('./designation/designationRoute');

// multiple module route add here
router.use('/', authRoute);
router.use('/client', clientDetailsRoute);
router.use('/designation', designationRoute);

router.get('/', (req, res) => {
  return res.status(200).json({ message: 'Welcome to WIS-EMS api.' });
});

module.exports = router;
