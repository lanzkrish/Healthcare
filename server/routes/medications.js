/**
 * Medication Routes (protected)
 */
const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { validate } = require('../middleware/validate');
const { protect, caregiverAccess } = require('../middleware/auth');
const {
  getMedications, createMedication, updateMedication, deleteMedication, markAsTaken,
} = require('../controllers/medicationController');

const medicationValidation = [
  body('name').trim().notEmpty().withMessage('Medication name is required'),
  body('dosage').trim().notEmpty().withMessage('Dosage is required'),
  body('frequency').isIn(['once_daily', 'twice_daily', 'thrice_daily', 'weekly', 'as_needed'])
    .withMessage('Valid frequency is required'),
  body('times').isArray({ min: 1 }).withMessage('At least one time is required'),
];

router.use(protect, caregiverAccess);

router.route('/')
  .get(getMedications)
  .post(medicationValidation, validate, createMedication);

router.route('/:id')
  .put(updateMedication)
  .delete(deleteMedication);

router.post('/:id/taken', markAsTaken);

module.exports = router;
