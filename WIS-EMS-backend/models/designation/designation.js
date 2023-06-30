const mongoose = require('mongoose');
const { wisDB } = require('../../config/connection');

const DesignationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
  },
  { timestamps: true }
);

const Designation = wisDB.model(
  'designation',
  DesignationSchema,
  'Designation'
);

module.exports = { Designation };
