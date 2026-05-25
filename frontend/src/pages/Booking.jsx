import { useMemo, useState } from 'react';
import { createAppointment } from '../services/api';

const days = ['Lunes', 'Martes', 'Jueves', 'Viernes'];
const generateDates = () => {
  const today = new Date();
  const options = [];
  for (let i = 1; i <= 28; i += 1) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dayName = date.toLocaleDateString('es-AR', { weekday: 'long' });
    const capitalized = dayName.charAt(0).toUpperCase() + dayName.slice(1);
    if (days.includes(capitalized)) {
      const formatted = `${capitalized}, ${date.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })}`;
      options.push(formatted);
    }
  }
  return options;
};

const timeOptions = Array.from({ length: 9 }, (_, idx) => `${12 + idx}:00`);

export default function Booking() {
  const dates = useMemo(() => generateDates(), []);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    area: '',
    laserExperience: 'NO',
    knowsTreatment: 'NO',
    date: dates[0] || '',
    time: '12:00'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const response = await createAppointment(form);
      setMessage(response.data.message);
      setForm({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        area: '',
        laserExperience: 'NO',
        knowsTreatment: 'NO',
        date: dates[0] || '',
        time: '12:00'
      });
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo reservar el turno. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Reserva tu turno</p>
          <h1 className="mt-4 text-3xl font-semibold text-slate-950 sm:text-4xl">Agenda tu sesión en Cutaneo.</h1>
          <p className="mt-4 text-slate-600">Completa los datos y elige el día y la hora disponibles. Recibirás confirmación con un enlace para cancelar si fuera necesario.</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm">
              <span>Nombre</span>
              <input name="firstName" value={form.firstName} onChange={handleChange} required className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 focus:border-black focus:outline-none" />
            </label>
            <label className="space-y-2 text-sm">
              <span>Apellido</span>
              <input name="lastName" value={form.lastName} onChange={handleChange} required className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 focus:border-black focus:outline-none" />
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm">
              <span>Celular</span>
              <input name="phone" value={form.phone} onChange={handleChange} required className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 focus:border-black focus:outline-none" />
            </label>
            <label className="space-y-2 text-sm">
              <span>Email</span>
              <input type="email" name="email" value={form.email} onChange={handleChange} required className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 focus:border-black focus:outline-none" />
            </label>
          </div>
          <label className="space-y-2 text-sm">
            <span>¿Qué zona se va a depilar?</span>
            <textarea name="area" value={form.area} onChange={handleChange} required rows="3" className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 focus:border-black focus:outline-none" />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm">
              <span>¿Se depiló anteriormente con láser?</span>
              <select name="laserExperience" value={form.laserExperience} onChange={handleChange} className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 focus:border-black focus:outline-none">
                <option value="SI">SI</option>
                <option value="NO">NO</option>
              </select>
            </label>
            <label className="space-y-2 text-sm">
              <span>¿Conoce el tratamiento?</span>
              <select name="knowsTreatment" value={form.knowsTreatment} onChange={handleChange} className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 focus:border-black focus:outline-none">
                <option value="SI">SI</option>
                <option value="NO">NO</option>
              </select>
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm">
              <span>Día disponible</span>
              <select name="date" value={form.date} onChange={handleChange} className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 focus:border-black focus:outline-none">
                {dates.map((day) => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-sm">
              <span>Hora</span>
              <select name="time" value={form.time} onChange={handleChange} className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 focus:border-black focus:outline-none">
                {timeOptions.map((time) => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </label>
          </div>
          {message && <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">{message}</div>}
          {error && <div className="rounded-3xl border border-rose-200 bg-rose-50 p-4 text-rose-800">{error}</div>}
          <button type="submit" disabled={loading} className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60">
            {loading ? 'Reservando...' : 'Confirmar reserva'}
          </button>
        </form>

        <aside className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-950">Horarios permitidos</h2>
          <p className="mt-4 text-slate-600">Solo se aceptan turnos en días y horarios autorizados:</p>
          <ul className="mt-4 space-y-3 text-slate-700">
            <li>• Lunes, Martes, Jueves y Viernes</li>
            <li>• Desde las 12:00 hs hasta las 20:00 hs</li>
            <li>• Sin Miércoles, Sábados ni Domingos</li>
          </ul>
          <div className="mt-6 rounded-3xl bg-slate-950 p-6 text-white">
            <p className="text-sm uppercase tracking-[0.35em] text-slate-300">Confiabilidad</p>
            <p className="mt-3 text-lg leading-8">Cada reserva genera un email con tu información y enlace para cancelar. El sistema liberará automáticamente el horario si decides anular.</p>
          </div>
        </aside>
      </div>
    </section>
  );
}
