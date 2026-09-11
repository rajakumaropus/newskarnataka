import { useStore } from '../lib/store';
import { authAPI } from '../lib/auth';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();
  const { user, setUser, setAuthenticated } = useStore();

  const handleLogout = () => {
    authAPI.logout();
    setUser(null);
    setAuthenticated(false);
    navigate('/login', { replace: true });
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">NewsKarnataka AI Console</h2>
        <p className="text-sm text-gray-600">Content Management & Publishing Platform</p>
      </div>

      <div className="flex items-center gap-4">
        {user && (
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-900">{user.username}</p>
            <p className="text-xs text-gray-600 capitalize">{user.role}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
