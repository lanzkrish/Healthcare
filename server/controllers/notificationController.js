/**
 * Notification Controller
 * Sends push notifications via Expo Push Notification API
 */
const { Expo } = require('expo-server-sdk');
const User = require('../models/User');

const expo = new Expo();

/**
 * POST /api/notifications/send
 * Send push notification to a specific user
 */
exports.sendNotification = async (req, res) => {
  try {
    const { userId, title, body, data } = req.body;

    const user = await User.findById(userId);
    if (!user || !user.expoPushToken) {
      return res.status(404).json({
        success: false,
        message: 'User not found or no push token registered',
      });
    }

    if (!Expo.isExpoPushToken(user.expoPushToken)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Expo push token',
      });
    }

    const messages = [{
      to: user.expoPushToken,
      sound: 'default',
      title,
      body,
      data: data || {},
    }];

    const chunks = expo.chunkPushNotifications(messages);
    const tickets = [];

    for (const chunk of chunks) {
      const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      tickets.push(...ticketChunk);
    }

    res.json({ success: true, data: { tickets } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * POST /api/notifications/reminder
 * Send appointment/medication reminder to a patient
 */
exports.sendReminder = async (req, res) => {
  try {
    const { patientId, type, title, body } = req.body;

    const patient = await User.findById(patientId);
    if (!patient || !patient.expoPushToken) {
      return res.status(404).json({ success: false, message: 'Patient or push token not found' });
    }

    if (!Expo.isExpoPushToken(patient.expoPushToken)) {
      return res.status(400).json({ success: false, message: 'Invalid push token' });
    }

    const ticket = await expo.sendPushNotificationsAsync([{
      to: patient.expoPushToken,
      sound: 'default',
      title: title || `${type} Reminder`,
      body: body || `You have an upcoming ${type}`,
      data: { type },
    }]);

    res.json({ success: true, data: { ticket } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
