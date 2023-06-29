const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      requred: true,
      trim: true,
    },
    emp_id: {
      type: String,
      requred: true,
      unique: true,
      trim: true,
    },
    phone_num: {
      type: Number,
      requred: true,
      unique: true,
    },
    email_id: {
      type: String,
      requred: true,
      unique: true,
      trim: true,
    },
    address: {
      type: String,
      requred: true,
      trim: true,
    },
    designation: {
      type: mongoose.Schema.Types.ObjectId,
      trim: true,
      ref: 'designation',
      default: null,
    },
    role: {
      type: String,
      enum: ['admin', 'employee', 'hr', 'accountant'],
      default: 'employee',
    },
    password: {
      type: String,
      requred: true,
      trim: true,
    },
    image: {
      type: String,
      detault: null,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      default: null,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    first_login: {
      type: Boolean,
      enum: [true, false],
      default: true,
    },
    holidays: [{ type: Number }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('user', UserSchema, 'User');
