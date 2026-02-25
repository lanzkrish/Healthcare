/**
 * Caregiver Controller
 * Handles linking caregivers to patients via access codes
 */
const User = require('../models/User');

/**
 * POST /api/caregiver/link
 * Link a caregiver account to a patient using their access code
 */
exports.linkCaregiver = async (req, res) => {
  try {
    const { accessCode } = req.body;

    if (req.user.role !== 'caregiver') {
      return res.status(403).json({
        success: false,
        message: 'Only caregivers can link to patients',
      });
    }

    // Find patient by access code
    const patient = await User.findOne({ accessCode, role: 'patient' });
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Invalid access code. No patient found.',
      });
    }

    // Link caregiver to patient
    req.user.linkedPatientId = patient._id;
    await req.user.save();

    res.json({
      success: true,
      message: `Successfully linked to patient: ${patient.name}`,
      data: {
        patientId: patient._id,
        patientName: patient.name,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/caregiver/patient
 * Get linked patient's profile info
 */
exports.getLinkedPatient = async (req, res) => {
  try {
    if (req.user.role !== 'caregiver' || !req.user.linkedPatientId) {
      return res.status(404).json({
        success: false,
        message: 'No patient linked',
      });
    }

    const patient = await User.findById(req.user.linkedPatientId).select('name email phone');
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Linked patient not found' });
    }

    res.json({ success: true, data: patient });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/caregiver/access-code
 * Get or regenerate access code for patient
 */
exports.getAccessCode = async (req, res) => {
  try {
    if (req.user.role !== 'patient') {
      return res.status(403).json({
        success: false,
        message: 'Only patients can generate access codes',
      });
    }

    if (!req.user.accessCode) {
      await req.user.generateAccessCode();
      await req.user.save();
    }

    res.json({
      success: true,
      data: { accessCode: req.user.accessCode },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
