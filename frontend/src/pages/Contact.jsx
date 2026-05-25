export default function Contact() {
  return (
    <section className="space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
        <h1 className="text-3xl font-semibold text-slate-950">Contacto</h1>
        <p className="mt-4 text-slate-600">Para consultas rápidas, enviá un mensaje y te responderemos lo antes posible.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-950">Datos de contacto</h2>
          <ul className="mt-6 space-y-4 text-slate-700">
            <li><span className="font-semibold">Teléfono:</span> +54 9 11 1234 5678</li>
            <li><span className="font-semibold">Email:</span> contacto@cutaneo.com.ar</li>
            <li><span className="font-semibold">Horario:</span> Lunes a Viernes 12:00 - 20:00</li>
          </ul>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-950">Mensaje</h2>
          <p className="mt-4 text-slate-600">Reservá tu turno y aprovecha un servicio personalizado con una interfaz elegante y fácil de usar.</p>
          <div className="mt-6 space-y-4 text-slate-700">
            <p>Estamos aquí para ayudarte a vivir la mejor experiencia estética.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
