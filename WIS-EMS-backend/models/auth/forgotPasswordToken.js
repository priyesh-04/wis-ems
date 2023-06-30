const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { wisDB } = require('../../config/connection');

const ForgotPasswordTokenSchema = new Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'user',
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    token: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);

const ForgotPasswordToken = wisDB.model(
  'ForgotPasswordToken',
  ForgotPasswordTokenSchema,
  'forgotPasswordToken'
);

module.exports = { ForgotPasswordToken };
