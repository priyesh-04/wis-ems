const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserTokenSchema = new Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    token: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('userToken', UserTokenSchema, 'UserToken');
