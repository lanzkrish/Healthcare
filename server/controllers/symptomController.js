/**
 * Symptom Controller
 * Create and retrieve daily symptom logs
 */
const SymptomLog = require('../models/SymptomLog');

/**
 * GET /api/symptoms
 * Get symptom logs with optional date range filtering
 */
exports.getSymptomLogs = async (req, res) => {
  try {
    const { startDate, endDate, limit } = req.query;
    const query = { patientId: req.patientId };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const logs = await SymptomLog.find(query)
      .sort({ date: -1 })
      .limit(parseInt(limit) || 30)
      .lean();

    res.json({ success: true, data: logs, count: logs.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * POST /api/symptoms
 * Create a new symptom log entry
 */
exports.createSymptomLog = async (req, res) => {
  try {
    const { date, mood, painLevel, symptoms, notes, synced } = req.body;

    const log = await SymptomLog.create({
      patientId: req.patientId,
      date: date || new Date(),
      mood,
      painLevel,
      symptoms,
      notes,
      synced: synced !== false,
    });

    res.status(201).json({ success: true, data: log });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * POST /api/symptoms/bulk
 * Sync offline symptom logs
 */
exports.bulkSync = async (req, res) => {
  try {
    const { logs } = req.body;
    
    const created = await SymptomLog.insertMany(
      logs.map((log) => ({ ...log, patientId: req.patientId, synced: true }))
    );

    res.status(201).json({ success: true, data: created, count: created.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
