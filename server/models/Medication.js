/**
 * Medication Model
 * Tracks patient medications and schedule
 */
const mongoose = require('mongoose');

const medicationSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Medication name is required'],
      trim: true,
    },
    dosage: {
      type: String,
      required: [true, 'Dosage is required'],
      trim: true,
    },
    frequency: {
      type: String,
      required: [true, 'Frequency is required'],
      enum: ['once_daily', 'twice_daily', 'thrice_daily', 'weekly', 'as_needed'],
    },
    times: [
      {
        type: String, // e.g., "08:00", "14:00", "20:00"
        required: true,
      },
    ],
    active: {
      type: Boolean,
      default: true,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
      default: null,
    },
    instructions: {
      type: String,
      trim: true,
    },
    takenLog: [
      {
        date: { type: Date, required: true },
        time: { type: String, required: true },
        taken: { type: Boolean, default: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Medication', medicationSchema);
