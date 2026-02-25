/**
 * FollowUp Controller
 * CRUD for scheduled follow-up events (scans, visits, lab tests)
 */
const FollowUp = require('../models/FollowUp');

exports.getFollowUps = async (req, res) => {
  try {
    const { status, type } = req.query;
    const query = { patientId: req.patientId };
    if (status) query.status = status;
    if (type) query.type = type;

    const followUps = await FollowUp.find(query)
      .sort({ scheduledDate: 1 })
      .lean();

    res.json({ success: true, data: followUps, count: followUps.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createFollowUp = async (req, res) => {
  try {
    const { title, scheduledDate, type, notes, location } = req.body;
    const followUp = await FollowUp.create({
      patientId: req.patientId,
      title, scheduledDate, type, notes, location,
    });
    res.status(201).json({ success: true, data: followUp });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateFollowUp = async (req, res) => {
  try {
    const followUp = await FollowUp.findOneAndUpdate(
      { _id: req.params.id, patientId: req.patientId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!followUp) {
      return res.status(404).json({ success: false, message: 'Follow-up not found' });
    }
    res.json({ success: true, data: followUp });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteFollowUp = async (req, res) => {
  try {
    const followUp = await FollowUp.findOneAndDelete({
      _id: req.params.id, patientId: req.patientId,
    });
    if (!followUp) {
      return res.status(404).json({ success: false, message: 'Follow-up not found' });
    }
    res.json({ success: true, message: 'Follow-up deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
