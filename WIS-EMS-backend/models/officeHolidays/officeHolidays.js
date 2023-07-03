const mongoose = require('mongoose');
const { wisDB } = require('../../config/connection');

const OfficeHolidaysSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      trim: true,
    },
    event: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const OfficeHolidays = wisDB.model(
  'OfficeHolidays',
  OfficeHolidaysSchema,
  'officeHolidays'
);

module.exports = { OfficeHolidays };
