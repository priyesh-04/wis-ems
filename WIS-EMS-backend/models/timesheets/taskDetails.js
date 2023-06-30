const mongoose = require('mongoose');
const { wisDB } = require('../../config/connection');

const TaskDetailsSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      trim: true,
      ref: 'ClientDetails',
    },
    project_name: {
      type: String,
      required: true,
      trim: true,
    },
    start_time: {
      type: Date,
      required: true,
      trim: true,
    },
    end_time: {
      type: Date,
      required: true,
      trim: true,
    },
    time_spend: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      trim: true,
      ref: 'user',
    },
  },
  { timestamps: true }
);

const TaskDetails = wisDB.model(
  'TaskDetails',
  TaskDetailsSchema,
  'taskDetails'
);

module.exports = { TaskDetails };
