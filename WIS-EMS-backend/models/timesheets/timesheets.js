const mongoose = require('mongoose');

const TimeSheetSchema = new mongoose.Schema(
  {
    in_time: {
      type: Date,
      // required: true,
      trim: true,
      default: null,
    },
    out_time: {
      type: Date,
      default: null,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
      trim: true,
    },
    // is_editable: {
    //   type: Boolean,
    //   enum: [true, false],
    //   default: true,
    // },
    // edit_request: {
    //   type: Boolean,
    //   enum: [true, false],
    //   default: false,
    // },
    edit_status: {
      type: String,
      enum: [
        'New',
        'Initial',
        'Requested',
        'Accepted',
        'Pending',
        'Edited',
        'Rejected',
      ],
      trim: true,
      default: 'New',
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      trim: true,
      ref: 'user',
    },
    leave: {
      type: Boolean,
      default: false,
      required: true,
    },
    is_holiday: {
      type: Boolean,
      default: false,
      required: true,
    },
    edit_reason: [
      {
        name: { type: String, trim: true },
        date: { type: Date, default: new Date() },
      },
    ],
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
