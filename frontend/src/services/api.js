import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE ?? (import.meta.env.DEV ? 'http://localhost:4000/api' : '/api');
const api = axios.create({ baseURL });

export const createAppointment = (payload) => api.post('/appointments', payload);
export const cancelAppointment = (token) => api.post('/appointments/cancel', { token });
export const adminLogin = (password) => api.post('/admin/login', { password });
export const getAdminAppointments = (token, filters = {}) =>
  api.get('/admin/appointments', {
    headers: { Authorization: `Bearer ${token}` },
    params: filters
  });
export const rescheduleAppointment = (token, id, payload) =>
  api.put(`/admin/appointments/${id}`, payload, { headers: { Authorization: `Bearer ${token}` } });
export const cancelAppointmentAdmin = (token, id) =>
  api.delete(`/admin/appointments/${id}`, { headers: { Authorization: `Bearer ${token}` } });
