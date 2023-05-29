const mongoose = require('mongoose');

const TimeSheetSchema = new mongoose.Schema(
  {
    in_time: {
      type: Date,
      required: true,
      trim: true,
      immutable: true,
    },
    out_time: {
      type: Date,
      required: true,
      trim: true,
      immutable: true,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      trim: true,
    },
    task_details: [
      {
        client: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          trim: true,
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
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Timesheets', TimeSheetSchema, 'timesheets');
