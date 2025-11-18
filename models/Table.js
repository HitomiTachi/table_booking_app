const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
  status: { type: String, enum: ['available', 'reserved', 'occupied'] }, // Confirming existing schema
  capacity: Number,
  location: String,
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Table', tableSchema);