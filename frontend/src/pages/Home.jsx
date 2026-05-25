import { Link } from 'react-router-dom';

const highlights = [
  { title: 'Reserva rápida', description: 'Selecciona tu turno sin registros ni complicaciones.' },
  { title: 'Confirmación por email', description: 'Recibe confirmación instantánea con cancelación segura.' },
  { title: 'Horarios premium', description: 'Turnos disponibles de 12:00 a 20:00 en días selectos.' }
];

export default function Home() {
  return (
    <section className="space-y-12">
      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-sm sm:p-12">
        <p className="uppercase tracking-[0.34em] text-sm text-slate-500">Cutaneo</p>
        <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
          Reserva tu turno de estética con una experiencia premium y minimalista.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
          Cutaneo te ofrece una reserva simple, flexible y segura. Elige zona, día y hora. Confirma de inmediato y recibe tu enlace para cancelar cuando lo necesites.
        </p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Link to="/reservar" className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
            Reservar turno
          </Link>
          <Link to="/tratamiento" className="inline-flex items-center justify-center rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100">
            Información del tratamiento
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {highlights.map((item) => (
          <article key={item.title} className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-950">{item.title}</h2>
            <p className="mt-3 text-slate-600">{item.description}</p>
          </article>
        ))}
      </div>

      <div className="rounded-3xl bg-slate-950 p-10 text-white shadow-lg">
        <div className="max-w-4xl">
          <h2 className="text-3xl font-semibold">Tu espacio de belleza pensado con cuidado.</h2>
          <p className="mt-4 text-lg leading-8 text-slate-300">
            En Cutaneo, la experiencia es tan importante como el resultado. Disfruta de una plataforma limpia, responsive y fácil de usar que acompaña cada paso de tu reserva.
          </p>
        </div>
      </div>
    </section>
  );
}
