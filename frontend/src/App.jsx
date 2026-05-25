import { useState } from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Booking from './pages/Booking';
import Cancel from './pages/Cancel';
import Info from './pages/Info';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import logo from './assets/logo-cutaneo.svg';

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'Reservar', path: '/reservar' },
  { label: 'Cancelar', path: '/cancelar' },
  { label: 'Tratamiento', path: '/tratamiento' },
  { label: 'Contacto', path: '/contacto' },
  { label: 'Panel', path: '/admin' }
];

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate('/')}>
            <img src={logo} alt="Logo Cutaneo" className="h-12 w-auto" />
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Centro de estética</p>
            </div>
          </div>
          <nav className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `text-sm font-medium transition ${isActive ? 'text-black' : 'text-slate-500 hover:text-black'}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <button
            className="md:hidden rounded-full border border-slate-200 p-3 text-slate-600"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Abrir menú"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
        {menuOpen && (
          <div className="border-t border-slate-200 bg-white px-6 py-4 md:hidden">
            <div className="flex flex-col gap-3">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className="text-sm font-medium text-slate-700"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10 sm:py-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/reservar" element={<Booking />} />
          <Route path="/cancelar" element={<Cancel />} />
          <Route path="/tratamiento" element={<Info />} />
          <Route path="/contacto" element={<Contact />} />
          <Route path="/admin" element={<Admin logo={logo} />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
