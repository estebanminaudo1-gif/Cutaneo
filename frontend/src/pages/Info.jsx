export default function Info() {
  return (
    <section className="space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
        <h1 className="text-3xl font-semibold text-slate-950">Tratamiento de depilación láser</h1>
        <p className="mt-4 text-slate-600">Nuestro enfoque combina técnica profesional, comodidad y resultados visibles. Ideal para quienes buscan una piel suave y libre de vello en zonas localizadas.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <article className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-xl font-semibold text-slate-950">Zonas tratadas</h2>
          <p className="mt-3 text-slate-600">Cejas, entrecejo, labio superior, mentón, axilas, bikini y más. Indica la zona en el formulario con libertad de texto.</p>
        </article>
        <article className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-xl font-semibold text-slate-950">Resultados</h2>
          <p className="mt-3 text-slate-600">Reducción progresiva del vello, piel más lisa y menos irritación. Nuestros clientes valoran la experiencia moderna y segura.</p>
        </article>
        <article className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-xl font-semibold text-slate-950">Preparación</h2>
          <p className="mt-3 text-slate-600">Responde si ya conoces el tratamiento y si usaste láser antes. Esto nos ayuda a personalizar la sesión.</p>
        </article>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
        <h2 className="text-2xl font-semibold text-slate-950">¿Tenés dudas?</h2>
        <p className="mt-4 text-slate-600">Si no estás segura de qué zona seleccionar o si el tratamiento es para vos, nuestro equipo revisará tu reserva y te contactará para confirmar.</p>
      </div>
    </section>
  );
}
