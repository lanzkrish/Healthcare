/**
 * SymptomLog Model
 * Daily symptom tracking for patients
 */
const mongoose = require('mongoose');

const symptomLogSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    mood: {
      type: String,
      enum: ['great', 'good', 'okay', 'bad', 'terrible'],
      required: true,
    },
    painLevel: {
      type: Number,
      min: 0,
      max: 10,
      required: true,
    },
    symptoms: [
      {
        type: String,
        trim: true,
      },
    ],
    notes: {
      type: String,
      trim: true,
    },
    synced: {
      type: Boolean,
      default: true, // false when created offline
    },
  },
  {
    timestamps: true,
  }
);

// One log per patient per day (using date without time comparison)
symptomLogSchema.index({ patientId: 1, date: -1 });

module.exports = mongoose.model('SymptomLog', symptomLogSchema);
