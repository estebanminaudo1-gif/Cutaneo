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

## Despliegue en Vercel

- Si despliegas desde la raíz del repo, Vercel usará `vercel.json` en la raíz.
- Si despliegas solo la carpeta `frontend`, Vercel usará `frontend/vercel.json`.
- Build Command: `npm install && npm run build`
- Output Directory: `dist`
- Asegúrate de configurar la variable de entorno `VITE_API_BASE` en Vercel con la URL de tu backend (por ejemplo, `https://mi-backend.example.com/api`).
- Si cargas rutas directas como `/admin`, Vercel redirigirá todas las rutas a `index.html` gracias a `vercel.json`.
