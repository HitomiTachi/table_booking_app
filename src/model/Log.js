const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  actorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // No change
  action: String, // No change
  time: Date, // No change
  target: String, // No change
});

module.exports = mongoose.model('Log', logSchema);