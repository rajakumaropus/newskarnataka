import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../lib/store';

export default function Sidebar() {
  const location = useLocation();
  const { sidebarOpen, setSidebarOpen } = useStore();

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gray-900 text-white transition-all duration-300 flex flex-col`}>
      {/* Logo */}
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        <h1 className={`font-bold ${sidebarOpen ? 'text-lg' : 'text-xs text-center w-full'}`}>
          {sidebarOpen ? 'NewsKarnataka' : 'NK'}
        </h1>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4 space-y-2">
        <NavItem
          to="/"
          icon="📊"
          label="Dashboard"
          isActive={isActive('/')}
          sidebarOpen={sidebarOpen}
        />
        <NavItem
          to="/submit"
          icon="✍️"
          label="Submit Article"
          isActive={isActive('/submit')}
          sidebarOpen={sidebarOpen}
        />
        <NavItem
          to="/queue"
          icon="📋"
          label="Content Queue"
          isActive={isActive('/queue')}
          sidebarOpen={sidebarOpen}
        />
      </nav>

      {/* Toggle Button */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-700 text-sm"
        >
          {sidebarOpen ? '←' : '→'}
        </button>
      </div>
    </aside>
  );
}

interface NavItemProps {
  to: string;
  icon: string;
  label: string;
  isActive: boolean;
  sidebarOpen: boolean;
}

function NavItem({ to, icon, label, isActive, sidebarOpen }: NavItemProps) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
        isActive
          ? 'bg-blue-600 text-white'
          : 'text-gray-300 hover:bg-gray-800'
      }`}
      title={!sidebarOpen ? label : ''}
    >
      <span>{icon}</span>
      {sidebarOpen && <span>{label}</span>}
    </Link>
  );
}
