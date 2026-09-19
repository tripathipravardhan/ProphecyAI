import { NavLink } from 'react-router-dom';
import { Activity, Compass, ClipboardList, Layers3, Home, TrendingUp, Sparkles, X } from 'lucide-react';

export default function Sidebar({ menuOpen, setMenuOpen }) {
  const nav = [
    { id: '/', label: 'Overview', icon: Home, exact: true },
    { id: '/analyze', label: 'Analyze', icon: Compass },
    { id: '/properties', label: 'Properties', icon: ClipboardList },
    { id: '/explore', label: '3D Explorer', icon: Layers3 },
    { id: '/compare', label: 'Compare', icon: Activity },
    { id: '/insights', label: 'Insights', icon: TrendingUp },
  ];

  return (
    <aside className={`sidebar ${menuOpen ? 'open' : ''}`}>
      <nav>
        {nav.map(({ id, label, icon: Icon, exact }) => (
          <NavLink
            key={id}
            to={id}
            end={exact}
            className={({ isActive }) => (isActive ? 'nav-active' : '')}
            onClick={() => setMenuOpen(false)}
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-note">
        <Sparkles size={16} />
        <span>
          Spatial intelligence<br />for confident decisions
        </span>
      </div>
    </aside>
  );
}
