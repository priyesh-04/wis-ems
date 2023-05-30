const mongoose = require('mongoose');

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

module.exports = mongoose.model(
  'designation',
  DesignationSchema,
  'Designation'
);