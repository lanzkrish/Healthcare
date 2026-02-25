/**
 * Follow-up Routes (protected)
 */
const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { validate } = require('../middleware/validate');
const { protect, caregiverAccess } = require('../middleware/auth');
const {
  getFollowUps, createFollowUp, updateFollowUp, deleteFollowUp,
} = require('../controllers/followupController');

const followUpValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('scheduledDate').isISO8601().withMessage('Valid date is required'),
  body('type').isIn(['scan', 'doctor_visit', 'lab_test', 'other']).withMessage('Valid type is required'),
];

router.use(protect, caregiverAccess);

router.route('/')
  .get(getFollowUps)
  .post(followUpValidation, validate, createFollowUp);

router.route('/:id')
  .put(updateFollowUp)
  .delete(deleteFollowUp);

module.exports = router;
