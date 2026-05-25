# Cutaneo

Aplicación web completa para el centro de estética Cutaneo.

## Tecnologías

- Frontend: React + Vite + TailwindCSS
- Backend: Node.js + Express
- Base de datos: MongoDB
- Email: Nodemailer

## Estructura

- `backend/` - API, modelos, rutas, servicio de email
- `frontend/` - aplicación web React responsive

## Configuración

1. Crear y configurar el archivo `backend/.env` usando `backend/.env.example`.
2. Instalar dependencias:
   - `cd backend && npm install`
   - `cd ../frontend && npm install`
3. Iniciar servicios:
   - `cd backend && npm run dev`
   - `cd ../frontend && npm run dev`

## Endpoints principales

- `POST /api/appointments` - Crear turno
- `POST /api/appointments/cancel` - Cancelar por token
- `POST /api/admin/login` - Login administrador
- `GET /api/admin/appointments` - Listar turnos (token admin)
- `PUT /api/admin/appointments/:id` - Reprogramar turno
- `DELETE /api/admin/appointments/:id` - Cancelar turno manualmente

## Notas importantes

- No hay registro de usuarios; el cliente completa el formulario.
- El email de confirmación incluye enlace seguro de cancelación.
- El panel admin usa una contraseña simple en `ADMIN_PASSWORD`.
- Solo se permiten turnos de lunes, martes, jueves y viernes entre 12:00 y 20:00.
