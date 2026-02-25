/**
 * Caregiver Routes (protected)
 */
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { linkCaregiver, getLinkedPatient, getAccessCode } = require('../controllers/caregiverController');

router.use(protect);

router.post('/link', linkCaregiver);
router.get('/patient', getLinkedPatient);
router.get('/access-code', getAccessCode);

module.exports = router;
