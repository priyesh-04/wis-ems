const mongoose = require('mongoose');

const ClientDetailsSchema = mongoose.Schema(
  {
    company_name: {
      type: String,
      trim: true,
      required: true,
    },
    company_email: {
      type: String,
      trim: true,
      required: true,
    },
    phone_number: {
      type: Number,
      trim: true,
      required: true,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    person_name: {
      type: String,
      trim: true,
    },
    start_date: {
      type: Date,
      default: null,
    },
    end_date: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  'ClientDetails',
  ClientDetailsSchema,
  'clientDetails'
);
