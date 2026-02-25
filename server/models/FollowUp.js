/**
 * FollowUp Model
 * Scheduled follow-up events (scans, doctor visits, lab tests)
 */
const mongoose = require('mongoose');

const followUpSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    scheduledDate: {
      type: Date,
      required: [true, 'Scheduled date is required'],
    },
    type: {
      type: String,
      enum: ['scan', 'doctor_visit', 'lab_test', 'other'],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'cancelled'],
      default: 'pending',
    },
    notes: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

followUpSchema.index({ patientId: 1, scheduledDate: 1 });

module.exports = mongoose.model('FollowUp', followUpSchema);
