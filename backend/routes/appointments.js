const express = require('express');
const { v4: uuidv4 } = require('uuid');
const supabase = require('../config/supabase');
const { validateAppointmentPayload } = require('../utils/validators');
const { sendConfirmationEmail } = require('../services/emailService');

const router = express.Router();

// POST /api/appointments — Reservar un nuevo turno
router.post('/', async (req, res, next) => {
  try {
    const validationMessage = validateAppointmentPayload(req.body);
    if (validationMessage) return res.status(400).json({ error: validationMessage });

    const { firstName, lastName, phone, email, date, time, area, laserExperience, knowsTreatment } = req.body;

    // Verificar que el horario no esté ocupado
    const { data: existing, error: existingError } = await supabase
      .from('appointments')
      .select('id')
      .eq('date', date)
      .eq('time', time)
      .eq('status', 'RESERVED')
      .maybeSingle();

    if (existingError) throw existingError;
    if (existing) {
      return res.status(409).json({ error: 'El horario ya está reservado. Por favor elige otro turno.' });
    }

    // Buscar o crear cliente por email
    const emailNormalized = email.toLowerCase().trim();
    let { data: client, error: clientFindError } = await supabase
      .from('clients')
      .select('id')
      .eq('email', emailNormalized)
      .maybeSingle();

    if (clientFindError) throw clientFindError;

    if (!client) {
      const { data: newClient, error: clientCreateError } = await supabase
        .from('clients')
        .insert({ first_name: firstName.trim(), last_name: lastName.trim(), phone: phone.trim(), email: emailNormalized })
        .select('id')
        .single();
      if (clientCreateError) throw clientCreateError;
      client = newClient;
    }

    // Crear el turno
    const cancelToken = uuidv4();
    const { data: appointment, error: apptError } = await supabase
      .from('appointments')
      .insert({
        client_id: client.id,
        date,
        time,
        area: area.trim(),
        laser_experience: laserExperience,
        knows_treatment: knowsTreatment,
        status: 'RESERVED',
        cancel_token: cancelToken
      })
      .select('id')
      .single();

    if (apptError) throw apptError;

    // Registrar historial
    await supabase.from('appointment_history').insert({
      appointment_id: appointment.id,
      event: 'CREATED',
      detail: 'Turno reservado por cliente.'
    });

    // Enviar email de confirmación
    const cancelLink = `${process.env.FRONTEND_URL}/cancel?token=${cancelToken}`;
    await sendConfirmationEmail({ firstName, email: emailNormalized, date, time, area, cancelLink });

    return res.status(201).json({
      message: 'Turno reservado con éxito. Revisa tu email para confirmar.',
      appointmentId: appointment.id
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/appointments/cancel — Cancelar por token
router.post('/cancel', async (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ error: 'Token de cancelación requerido.' });

    // Buscar el turno con el token y traer datos del cliente
    const { data: appointment, error: findError } = await supabase
      .from('appointments')
      .select('id, status, clients(first_name, last_name, email)')
      .eq('cancel_token', token)
      .eq('status', 'RESERVED')
      .maybeSingle();

    if (findError) throw findError;
    if (!appointment) return res.status(404).json({ error: 'Turno no encontrado o ya cancelado.' });

    // Cancelar el turno
    const { error: updateError } = await supabase
      .from('appointments')
      .update({ status: 'CANCELLED' })
      .eq('id', appointment.id);

    if (updateError) throw updateError;

    // Registrar en historial
    await supabase.from('appointment_history').insert({
      appointment_id: appointment.id,
      event: 'CANCELLED',
      detail: 'Turno cancelado por enlace directo.'
    });

    return res.json({ message: 'Tu turno fue cancelado correctamente.' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
