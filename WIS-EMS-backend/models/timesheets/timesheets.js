const mongoose = require('mongoose');

const TimeSheetSchema = new mongoose.Schema(
  {
    in_time: {
      type: Date,
      required: true,
      trim: true,
    },
    out_time: {
      type: Date,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
      trim: true,
    },
    is_editable: {
      type: Boolean,
      enum: [true, false],
      default: true,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      trim: true,
      ref: 'user',
    },
    task_details: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        trim: true,
        ref: 'TaskDetails',
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Timesheets', TimeSheetSchema, 'timesheets');
