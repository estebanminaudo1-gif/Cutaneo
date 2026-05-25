const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const allowedDays = ['Lunes', 'Martes', 'Jueves', 'Viernes'];
const minHour = 12;
const maxHour = 20;

const validateAppointmentPayload = ({ firstName, lastName, phone, email, date, time, area, laserExperience, knowsTreatment }) => {
  if (!firstName || !lastName || !phone || !email || !date || !time || !area) {
    return 'Todos los campos obligatorios deben estar completos.';
  }
  if (!emailRegex.test(email)) {
    return 'Debes ingresar un email válido.';
  }
  const [dayName, dayDate] = date.split(',').map((value) => value.trim());
  if (!allowedDays.includes(dayName)) {
    return 'Solo se permiten turnos de Lunes, Martes, Jueves y Viernes.';
  }

  const [hourString] = time.split(':');
  const hour = Number(hourString);
  if (Number.isNaN(hour) || hour < minHour || hour > maxHour) {
    return 'El turno debe ubicarse entre las 12:00 y las 20:00 hs.';
  }

  if (!['SI', 'NO'].includes(laserExperience) || !['SI', 'NO'].includes(knowsTreatment)) {
    return 'Las preguntas de experiencia deben responderse con SI o NO.';
  }

  return null;
};

module.exports = { validateAppointmentPayload, allowedDays, minHour, maxHour };
