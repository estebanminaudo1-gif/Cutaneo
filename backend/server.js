const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const appointmentRoutes = require('./routes/appointments');
const adminRoutes = require('./routes/admin');

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok', name: 'Cutaneo API (Supabase)' }));
app.use('/api/appointments', appointmentRoutes);
app.use('/api/admin', adminRoutes);

// Manejo global de errores
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  return res.status(status).json({ error: err.message || 'Server error' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Cutaneo backend running on port ${PORT} — Powered by Supabase`));
