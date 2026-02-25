/**
 * Authentication Middleware
 * Verifies JWT tokens and handles role-based access control
 */
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Verify JWT access token from Authorization header
 */
const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach user to request (without password)
    req.user = await User.findById(decoded.id);
    
    if (!req.user || !req.user.isActive) {
      return res.status(401).json({ success: false, message: 'User not found or deactivated' });
    }

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token expired', code: 'TOKEN_EXPIRED' });
    }
    return res.status(401).json({ success: false, message: 'Not authorized' });
  }
};

/**
 * Role-based access control middleware
 * @param  {...string} roles - Allowed roles (e.g., 'patient', 'caregiver', 'admin')
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role '${req.user.role}' is not authorized to access this route`,
      });
    }
    next();
  };
};

/**
 * Middleware to check if caregiver has access to patient data
 * Caregivers can only access their linked patient's data
 */
const caregiverAccess = async (req, res, next) => {
  if (req.user.role === 'caregiver') {
    if (!req.user.linkedPatientId) {
      return res.status(403).json({
        success: false,
        message: 'Caregiver not linked to any patient',
      });
    }
    // Set the patient ID to the linked patient for caregiver queries
    req.patientId = req.user.linkedPatientId;
  } else {
    req.patientId = req.user._id;
  }
  next();
};

module.exports = { protect, authorize, caregiverAccess };
