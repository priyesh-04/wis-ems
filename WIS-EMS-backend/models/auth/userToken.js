const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { wisDB } = require('../../config/connection');

const UserTokenSchema = new Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'user',
    },
    token: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);

const UserToken = wisDB.model('userToken', UserTokenSchema, 'UserToken');

module.exports = { UserToken };
