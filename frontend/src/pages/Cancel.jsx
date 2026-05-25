import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { cancelAppointment } from '../services/api';

export default function Cancel() {
  const [searchParams] = useSearchParams();
  const tokenParam = searchParams.get('token') || '';
  const [token, setToken] = useState(tokenParam);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (tokenParam) {
      setToken(tokenParam);
    }
  }, [tokenParam]);

  const handleCancel = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const response = await cancelAppointment(token);
      setMessage(response.data.message);
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo cancelar el turno. Verifica el enlace o intenta más tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
        <h1 className="text-3xl font-semibold text-slate-950">Cancelar turno</h1>
        <p className="mt-4 text-slate-600">Utiliza el enlace recibido en tu email o copia el token de cancelación para liberar tu horario de forma segura.</p>
      </div>

      <form onSubmit={handleCancel} className="rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-sm sm:p-10">
        <label className="space-y-3 text-sm">
          <span>Token de cancelación</span>
          <input value={token} onChange={(event) => setToken(event.target.value)} placeholder="Ingresa tu token o usa el enlace" className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 focus:border-black focus:outline-none" />
        </label>
        {message && <div className="mt-6 rounded-3xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">{message}</div>}
        {error && <div className="mt-6 rounded-3xl border border-rose-200 bg-rose-50 p-4 text-rose-800">{error}</div>}
        <button type="submit" disabled={loading} className="mt-6 inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60">
          {loading ? 'Cancelando...' : 'Cancelar turno'}
        </button>
      </form>
    </section>
  );
}
