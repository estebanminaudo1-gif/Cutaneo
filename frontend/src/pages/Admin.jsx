import { useEffect, useMemo, useState } from 'react';
import { adminLogin, cancelAppointmentAdmin, getAdminAppointments, rescheduleAppointment } from '../services/api';

const statusColors = { RESERVED: 'bg-emerald-100 text-emerald-800', CANCELLED: 'bg-rose-100 text-rose-800' };

export default function Admin({ logo }) {
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const fetchAppointments = async (filters = {}) => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const response = await getAdminAppointments(token, filters);
      setAppointments(response.data.appointments);
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudieron cargar los turnos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchAppointments();
  }, [token]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await adminLogin(password);
      setToken(response.data.token);
      setPassword('');
      setMessage('Ingreso exitoso. Cargando turnos...');
    } catch (err) {
      setError(err.response?.data?.error || 'Contraseña inválida.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    setLoading(true);
    try {
      await cancelAppointmentAdmin(token, id);
      setMessage('Turno cancelado manualmente.');
      await fetchAppointments({ date: dateFilter, client: query });
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cancelar el turno.');
    } finally {
      setLoading(false);
    }
  };

  const handleReschedule = async (id) => {
    const newDate = prompt('Nueva fecha (ej: Lunes, 20/05/2026):');
    const newTime = prompt('Nueva hora (ej: 15:00):');
    if (!newDate || !newTime) return;
    setLoading(true);
    try {
      await rescheduleAppointment(token, id, { date: newDate, time: newTime });
      setMessage('Turno reprogramado con éxito.');
      await fetchAppointments({ date: dateFilter, client: query });
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo reprogramar el turno.');
    } finally {
      setLoading(false);
    }
  };

  const filteredAppointments = useMemo(() => {
    if (!dateFilter && !query) return appointments;
    return appointments.filter((item) => {
      const matchesDate = dateFilter ? item.date === dateFilter : true;
      const term = query.toLowerCase();
      const matchesClient = term
        ? `${item.client.firstName} ${item.client.lastName}`.toLowerCase().includes(term) || item.client.email.toLowerCase().includes(term)
        : true;
      return matchesDate && matchesClient;
    });
  }, [appointments, dateFilter, query]);

  return (
    <section className="space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <img src={logo} alt="Logo Cutaneo" className="h-12 w-auto" />
            <h1 className="mt-4 text-3xl font-semibold text-slate-950">Panel administrativo</h1>
            <p className="mt-2 text-slate-600">Visualiza y administra reservas, horarios ocupados y cancelaciones en un solo lugar.</p>
          </div>
        </div>
      </div>

      {!token ? (
        <form onSubmit={handleLogin} className="rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-sm sm:p-10">
          <label className="space-y-3 text-sm">
            <span>Contraseña simple de administrador</span>
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 focus:border-black focus:outline-none" />
          </label>
          {error && <div className="mt-6 rounded-3xl border border-rose-200 bg-rose-50 p-4 text-rose-800">{error}</div>}
          <button type="submit" disabled={loading} className="mt-6 inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60">
            {loading ? 'Verificando...' : 'Ingresar'}
          </button>
        </form>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <label className="space-y-2 text-sm">
              <span>Filtrar por fecha</span>
              <input type="text" placeholder="Ej: Lunes, 20/05/2026" value={dateFilter} onChange={(event) => setDateFilter(event.target.value)} className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 focus:border-black focus:outline-none" />
            </label>
            <label className="space-y-2 text-sm">
              <span>Buscar cliente</span>
              <input type="text" placeholder="Nombre, apellido o email" value={query} onChange={(event) => setQuery(event.target.value)} className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 focus:border-black focus:outline-none" />
            </label>
            <div className="flex items-end gap-3">
              <button type="button" onClick={() => fetchAppointments({ date: dateFilter, client: query })} className="w-full rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">Actualizar</button>
              <button type="button" onClick={() => { setDateFilter(''); setQuery(''); }} className="w-full rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100">Limpiar</button>
            </div>
          </div>

          {message && <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">{message}</div>}
          {error && <div className="rounded-3xl border border-rose-200 bg-rose-50 p-4 text-rose-800">{error}</div>}

          <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-5 py-4 font-medium text-slate-700">Cliente</th>
                  <th className="px-5 py-4 font-medium text-slate-700">Email / Teléfono</th>
                  <th className="px-5 py-4 font-medium text-slate-700">Turno</th>
                  <th className="px-5 py-4 font-medium text-slate-700">Zona</th>
                  <th className="px-5 py-4 font-medium text-slate-700">Estado</th>
                  <th className="px-5 py-4 font-medium text-slate-700">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {loading ? (
                  <tr><td colSpan="6" className="px-5 py-6 text-center text-slate-500">Cargando turnos...</td></tr>
                ) : filteredAppointments.length === 0 ? (
                  <tr><td colSpan="6" className="px-5 py-6 text-center text-slate-500">No se encontraron turnos.</td></tr>
                ) : (
                  filteredAppointments.map((appointment) => (
                    <tr key={appointment._id}>
                      <td className="px-5 py-4">{appointment.client.firstName} {appointment.client.lastName}</td>
                      <td className="px-5 py-4">{appointment.client.email}<br />{appointment.client.phone}</td>
                      <td className="px-5 py-4">{appointment.date} · {appointment.time}</td>
                      <td className="px-5 py-4">{appointment.area}</td>
                      <td className="px-5 py-4"><span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusColors[appointment.status] || 'bg-slate-100 text-slate-700'}`}>{appointment.status}</span></td>
                      <td className="px-5 py-4 space-x-2">
                        {appointment.status === 'RESERVED' && (
                          <>
                            <button onClick={() => handleReschedule(appointment._id)} className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-900 transition hover:bg-slate-100">Reprogramar</button>
                            <button onClick={() => handleCancel(appointment._id)} className="rounded-full bg-rose-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-rose-700">Cancelar</button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
