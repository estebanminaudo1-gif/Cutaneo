const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  area: { type: String, required: true, trim: true },
  laserExperience: { type: String, enum: ['SI', 'NO'], required: true },
  knowsTreatment: { type: String, enum: ['SI', 'NO'], required: true },
  status: { type: String, enum: ['RESERVED', 'CANCELLED'], default: 'RESERVED' },
  cancelToken: { type: String, required: true, unique: true },
  history: [
    {
      event: String,
      detail: String,
      date: { type: Date, default: Date.now }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Appointment', appointmentSchema);
