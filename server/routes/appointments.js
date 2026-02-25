/**
 * Appointment Routes (protected)
 */
const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { validate } = require('../middleware/validate');
const { protect, caregiverAccess } = require('../middleware/auth');
const {
  getAppointments, getAppointment, createAppointment, updateAppointment, deleteAppointment,
} = require('../controllers/appointmentController');

const appointmentValidation = [
  body('doctorName').trim().notEmpty().withMessage('Doctor name is required'),
  body('department').trim().notEmpty().withMessage('Department is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('location').trim().notEmpty().withMessage('Location is required'),
];

router.use(protect, caregiverAccess);

router.route('/')
  .get(getAppointments)
  .post(appointmentValidation, validate, createAppointment);

router.route('/:id')
  .get(getAppointment)
  .put(updateAppointment)
  .delete(deleteAppointment);

module.exports = router;
