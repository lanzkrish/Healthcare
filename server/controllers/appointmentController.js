/**
 * Appointment Controller
 * CRUD operations for patient appointments
 */
const Appointment = require('../models/Appointment');

/**
 * GET /api/appointments
 * Get all appointments for the authenticated user
 */
exports.getAppointments = async (req, res) => {
  try {
    const { status, sort } = req.query;
    const query = { patientId: req.patientId };

    if (status) query.status = status;

    const appointments = await Appointment.find(query)
      .sort({ date: sort === 'desc' ? -1 : 1 })
      .lean();

    res.json({ success: true, data: appointments, count: appointments.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/appointments/:id
 * Get a single appointment by ID
 */
exports.getAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      patientId: req.patientId,
    });

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    res.json({ success: true, data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * POST /api/appointments
 * Create a new appointment
 */
exports.createAppointment = async (req, res) => {
  try {
    const { doctorName, department, date, location, notes } = req.body;

    const appointment = await Appointment.create({
      patientId: req.patientId,
      doctorName,
      department,
      date,
      location,
      notes,
    });

    res.status(201).json({ success: true, data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * PUT /api/appointments/:id
 * Update an appointment
 */
exports.updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findOneAndUpdate(
      { _id: req.params.id, patientId: req.patientId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    res.json({ success: true, data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * DELETE /api/appointments/:id
 * Delete an appointment
 */
exports.deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findOneAndDelete({
      _id: req.params.id,
      patientId: req.patientId,
    });

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    res.json({ success: true, message: 'Appointment deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
