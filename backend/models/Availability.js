const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
  day: { type: String, required: true, enum: ['Lunes', 'Martes', 'Jueves', 'Viernes'] },
  start: { type: String, required: true },
  end: { type: String, required: true },
  active: { type: Boolean, default: true }
});

module.exports = mongoose.model('Availability', availabilitySchema);
