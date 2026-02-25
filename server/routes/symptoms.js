/**
 * Symptom Routes (protected)
 */
const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { validate } = require('../middleware/validate');
const { protect, caregiverAccess } = require('../middleware/auth');
const { getSymptomLogs, createSymptomLog, bulkSync } = require('../controllers/symptomController');

const symptomValidation = [
  body('mood').isIn(['great', 'good', 'okay', 'bad', 'terrible']).withMessage('Valid mood is required'),
  body('painLevel').isInt({ min: 0, max: 10 }).withMessage('Pain level must be 0-10'),
  body('symptoms').isArray().withMessage('Symptoms must be an array'),
];

router.use(protect, caregiverAccess);

router.route('/')
  .get(getSymptomLogs)
  .post(symptomValidation, validate, createSymptomLog);

router.post('/bulk', bulkSync);

module.exports = router;
