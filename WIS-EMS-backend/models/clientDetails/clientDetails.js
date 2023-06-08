const mongoose = require('mongoose');

const ClientDetailsSchema = new mongoose.Schema(
  {
    client_name: {
      type: String,
      trim: true,
      required: true,
    },
    company_name: {
      type: String,
      trim: true,
      required: true,
    },
    mobile_number: {
      type: Number,
      trim: true,
      required: true,
    },
    person_name: {
      type: mongoose.Schema.Types.ObjectId,
      trim: true,
      required: true,
      ref: 'user',
    },
    company_email: {
      type: String,
      trim: true,
      required: true,
    },
    employee_assigned: [
      {
        type: mongoose.Schema.Types.ObjectId,
        trim: true,
      },
    ],
    is_active: {
      type: Boolean,
      default: true,
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
