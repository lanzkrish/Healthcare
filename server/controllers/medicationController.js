/**
 * Medication Controller
 * CRUD operations and taken-log tracking for medications
 */
const Medication = require('../models/Medication');

/**
 * GET /api/medications
 */
exports.getMedications = async (req, res) => {
  try {
    const { active } = req.query;
    const query = { patientId: req.patientId };
    if (active !== undefined) query.active = active === 'true';

    const medications = await Medication.find(query).sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: medications, count: medications.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * POST /api/medications
 */
exports.createMedication = async (req, res) => {
  try {
    const { name, dosage, frequency, times, instructions, startDate, endDate } = req.body;
    const medication = await Medication.create({
      patientId: req.patientId,
      name, dosage, frequency, times, instructions, startDate, endDate,
    });
    res.status(201).json({ success: true, data: medication });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * PUT /api/medications/:id
 */
exports.updateMedication = async (req, res) => {
  try {
    const medication = await Medication.findOneAndUpdate(
      { _id: req.params.id, patientId: req.patientId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!medication) {
      return res.status(404).json({ success: false, message: 'Medication not found' });
    }
    res.json({ success: true, data: medication });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * DELETE /api/medications/:id
 */
exports.deleteMedication = async (req, res) => {
  try {
    const medication = await Medication.findOneAndDelete({
      _id: req.params.id, patientId: req.patientId,
    });
    if (!medication) {
      return res.status(404).json({ success: false, message: 'Medication not found' });
    }
    res.json({ success: true, message: 'Medication deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * POST /api/medications/:id/taken
 * Mark a medication as taken for a specific time
 */
exports.markAsTaken = async (req, res) => {
  try {
    const { date, time, taken } = req.body;
    const medication = await Medication.findOne({
      _id: req.params.id, patientId: req.patientId,
    });
    if (!medication) {
      return res.status(404).json({ success: false, message: 'Medication not found' });
    }
    medication.takenLog.push({ date: date || new Date(), time, taken: taken !== false });
    await medication.save();
    res.json({ success: true, data: medication });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
