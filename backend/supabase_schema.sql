-- ============================================================
-- CUTANEO — Esquema SQL para Supabase
-- Pegar este contenido en: Supabase → SQL Editor → New Query → Run
-- ============================================================

-- Extensión para UUID (ya está habilitada por defecto en Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ──────────────────────────────────────────────
-- TABLA: clients
-- Almacena los datos del cliente que reserva el turno
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS clients (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name TEXT NOT NULL,
  last_name  TEXT NOT NULL,
  phone      TEXT NOT NULL,
  email      TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ──────────────────────────────────────────────
-- TABLA: appointments
-- Almacena cada turno reservado
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS appointments (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id        UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  date             TEXT NOT NULL,        -- Formato: "Lunes, 26/05/2026"
  time             TEXT NOT NULL,        -- Formato: "14:00"
  area             TEXT NOT NULL,        -- Zona a depilar (texto libre)
  laser_experience TEXT NOT NULL CHECK (laser_experience IN ('SI', 'NO')),
  knows_treatment  TEXT NOT NULL CHECK (knows_treatment IN ('SI', 'NO')),
  status           TEXT NOT NULL DEFAULT 'RESERVED' CHECK (status IN ('RESERVED', 'CANCELLED')),
  cancel_token     UUID NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índice para evitar duplicados de horario (date+time con status RESERVED)
CREATE UNIQUE INDEX IF NOT EXISTS uq_appointments_active_slot
  ON appointments(date, time)
  WHERE status = 'RESERVED';

-- ──────────────────────────────────────────────
-- TABLA: appointment_history
-- Registro de eventos por turno (CREATED, CANCELLED, RESCHEDULED)
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS appointment_history (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  event          TEXT NOT NULL,   -- 'CREATED' | 'CANCELLED' | 'RESCHEDULED'
  detail         TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ──────────────────────────────────────────────
-- TABLA: availability
-- Días y horarios habilitados para turnos
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS availability (
  id         SERIAL PRIMARY KEY,
  day        TEXT NOT NULL CHECK (day IN ('Lunes', 'Martes', 'Jueves', 'Viernes')),
  start_time TEXT NOT NULL DEFAULT '12:00',
  end_time   TEXT NOT NULL DEFAULT '20:00',
  active     BOOLEAN NOT NULL DEFAULT TRUE
);

-- ──────────────────────────────────────────────
-- DATOS INICIALES: Disponibilidad
-- ──────────────────────────────────────────────
INSERT INTO availability (day, start_time, end_time, active)
VALUES
  ('Lunes',   '12:00', '20:00', TRUE),
  ('Martes',  '12:00', '20:00', TRUE),
  ('Jueves',  '12:00', '20:00', TRUE),
  ('Viernes', '12:00', '20:00', TRUE)
ON CONFLICT DO NOTHING;

-- ──────────────────────────────────────────────
-- ROW LEVEL SECURITY (RLS)
-- El backend usa la service_role key, que omite RLS.
-- Las siguientes políticas son para referencia futura si usas la anon key.
-- ──────────────────────────────────────────────
ALTER TABLE clients            ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments       ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointment_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability       ENABLE ROW LEVEL SECURITY;

-- Política: solo el service role (backend) puede leer y escribir
-- (el backend usa service_role_key, así que estas tablas quedan protegidas del acceso público)
