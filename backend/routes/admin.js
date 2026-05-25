const express = require('express');
const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

const isProduction = process.env.NODE_ENV === 'production';

// Ruta de diagnóstico ligera (solo fuera de producción)
if (!isProduction) {
  router.get('/debug', (req, res) => {
    return res.json({
      adminPasswordSet: Boolean(process.env.ADMIN_PASSWORD),
      jwtSecretSet: Boolean(process.env.JWT_SECRET),
      supabaseConfigured: Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY)
    });
  });
}

// POST /api/admin/login
router.post('/login', (req, res) => {
  const { password } = req.body;

  if (!process.env.ADMIN_PASSWORD) {
    console.error('ADMIN_PASSWORD no configurada en el entorno.');
    return res.status(500).json({ error: 'Administración no configurada. Contacta al administrador.' });
  }

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    console.log('Intento de login fallido para admin:', { ip: req.ip });
    return res.status(401).json({ error: 'Contraseña incorrecta.' });
  }

  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET no configurado. Imposible emitir token.');
    return res.status(500).json({ error: 'Servidor mal configurado. JWT faltante.' });
  }

  const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '8h' });
  res.json({ token });
});

// Todas las rutas siguientes requieren autenticación
router.use(authMiddleware);

// GET /api/admin/appointments — Listar turnos con filtros opcionales
router.get('/appointments', async (req, res, next) => {
  try {
    const { date, client: clientSearch } = req.query;

    let query = supabase
      .from('appointments')
      .select(`
        id,
        date,
        time,
        area,
        laser_experience,
        knows_treatment,
        status,
        cancel_token,
        created_at,
        clients (
          id,
          first_name,
          last_name,
          phone,
          email
        ),
        appointment_history (
          event,
          detail,
          created_at
        )
      `)
      .order('date', { ascending: true })
      .order('time', { ascending: true });

    if (date) {
      query = query.eq('date', date);
    }

    const { data: appointments, error } = await query;
    if (error) throw error;

    // Filtro por nombre/email del cliente (se hace en memoria porque Supabase no permite
    // filtrar en tablas relacionadas directamente con ilike en el mismo query)
    let filtered = appointments;
    if (clientSearch) {
      const search = clientSearch.toLowerCase();
      filtered = appointments.filter((appt) => {
        const c = appt.clients;
        if (!c) return false;
        return (
          `${c.first_name} ${c.last_name}`.toLowerCase().includes(search) ||
          (c.email && c.email.toLowerCase().includes(search)) ||
          (c.phone && c.phone.includes(search)) ||
          (appt.area && appt.area.toLowerCase().includes(search))
        );
      });
    }

    res.json({ appointments: filtered });
  } catch (error) {
    next(error);
  }
});

// PUT /api/admin/appointments/:id — Reprogramar turno
router.put('/appointments/:id', async (req, res, next) => {
  try {
    const { date, time } = req.body;
    const { id } = req.params;
    if (!date || !time) return res.status(400).json({ error: 'Fecha y hora requeridas.' });

    // Verificar conflicto de horario
    const { data: conflict, error: conflictError } = await supabase
      .from('appointments')
      .select('id')
      .eq('date', date)
      .eq('time', time)
      .eq('status', 'RESERVED')
      .neq('id', id)
      .maybeSingle();

    if (conflictError) throw conflictError;
    if (conflict) return res.status(409).json({ error: 'Este horario ya está reservado.' });

    // Verificar que el turno existe
    const { data: existing, error: findError } = await supabase
      .from('appointments')
      .select('id')
      .eq('id', id)
      .maybeSingle();

    if (findError) throw findError;
    if (!existing) return res.status(404).json({ error: 'Turno no encontrado.' });

    // Actualizar el turno
    const { data: updated, error: updateError } = await supabase
      .from('appointments')
      .update({ date, time })
      .eq('id', id)
      .select(`
        id, date, time, area, laser_experience, knows_treatment, status,
        clients (id, first_name, last_name, phone, email)
      `)
      .single();

    if (updateError) throw updateError;

    // Historial
    await supabase.from('appointment_history').insert({
      appointment_id: id,
      event: 'RESCHEDULED',
      detail: `Reprogramado a ${date} - ${time}`
    });

    res.json({ appointment: updated });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/admin/appointments/:id — Cancelar turno manualmente
router.delete('/appointments/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const { data: existing, error: findError } = await supabase
      .from('appointments')
      .select('id')
      .eq('id', id)
      .maybeSingle();

    if (findError) throw findError;
    if (!existing) return res.status(404).json({ error: 'Turno no encontrado.' });

    const { error: updateError } = await supabase
      .from('appointments')
      .update({ status: 'CANCELLED' })
      .eq('id', id);

    if (updateError) throw updateError;

    await supabase.from('appointment_history').insert({
      appointment_id: id,
      event: 'CANCELLED',
      detail: 'Cancelado por administrador.'
    });

    res.json({ message: 'Turno cancelado manualmente.' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
