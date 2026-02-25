/**
 * User Model
 * Supports patient, caregiver, and admin roles
 * Caregivers can be linked to patients via accessCode
 */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    phone: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false, // Don't include password in queries by default
    },
    role: {
      type: String,
      enum: ['patient', 'caregiver', 'admin'],
      default: 'patient',
    },
    linkedPatientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    accessCode: {
      type: String,
      unique: true,
      sparse: true, // Allow multiple nulls
    },
    language: {
      type: String,
      default: 'en',
    },
    expoPushToken: {
      type: String,
      default: null,
    },
    refreshToken: {
      type: String,
      select: false,
    },
    avatar: {
      type: String,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Generate a random 6-char access code for caregiver linking
userSchema.methods.generateAccessCode = function () {
  const code = Math.random().toString(36).substring(2, 8).toUpperCase();
  this.accessCode = code;
  return code;
};

// Remove sensitive fields when converting to JSON
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshToken;
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
