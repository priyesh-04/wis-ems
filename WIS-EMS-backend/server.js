const express = require('express');
const { errorHandler } = require('./middlewares');
const routes = require('./routes');
const path = require('path');
const DB_Connection = require('./config/connection');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const cron = require('node-cron');
const { TimesheetCron } = require('./middlewares/cronJobs');

// Database connection
DB_Connection();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

global.appRoot = path.resolve(__dirname);

app.use('/api', routes);
app.use('/uploads', express.static('uploads'));

app.use(errorHandler);

function cronFunction() {
  // everyday 7:30AM
  cron.schedule(
    // '10 30 7 * * *',
    '10 * * * * *',
    () => {
      TimesheetCron.resetTimesheetEditPermission();
    },
    {
      scheduled: true,
      timezone: 'Asia/Kolkata',
    }
  );
}
cronFunction();
app.listen(process.env.APP_PORT, () =>
  console.log(`Listening on port ${process.env.APP_PORT}`)
);
