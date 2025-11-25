const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  duration: { type: Number, required: true }, // phút
  price: { type: Number, required: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Service', serviceSchema);