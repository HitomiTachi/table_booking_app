const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  tableId: { type: mongoose.Schema.Types.ObjectId, ref: 'Table' },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
  time: Date,
  status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'] },
});

module.exports = mongoose.model('Booking', bookingSchema);