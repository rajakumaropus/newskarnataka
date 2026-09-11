import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../lib/store';
import { authAPI } from '../lib/auth';

export default function Login() {
  const navigate = useNavigate();
  const { setUser, setAuthenticated } = useStore();
  const [email, setEmail] = useState('editor@newskarnataka.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [useDemo, setUseDemo] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (useDemo) {
        // Demo mode - instant login
        await new Promise((resolve) => setTimeout(resolve, 500));

        const mockUser = {
          id: '1',
          email,
          username: email.split('@')[0],
          role: 'editor' as const,
        };

        setUser(mockUser);
        setAuthenticated(true);
        authAPI.storeCredentials('demo-jwt-token-' + Date.now(), mockUser);
        navigate('/');
      } else {
        // Real Strapi authentication
        const response = await authAPI.login(email, password);
        const { jwt, user } = response;

        setUser(user);
        setAuthenticated(true);
        authAPI.storeCredentials(jwt, user);
        navigate('/');
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Login failed. Please check your credentials and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">NewsKarnataka</h1>
          <p className="text-gray-600 mt-2">AI Console</p>
          <p className="text-sm text-gray-500 mt-4">Content Management Platform</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Mode Toggle */}
          <div className="flex items-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <input
              type="checkbox"
              id="demo-mode"
              checked={useDemo}
              onChange={(e) => setUseDemo(e.target.checked)}
              className="rounded"
            />
            <label htmlFor="demo-mode" className="ml-2 text-sm text-gray-700">
              Demo mode (instant login)
            </label>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="your@email.com"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-center text-sm text-gray-600 mb-3">
            {useDemo ? '🔓 Demo Mode - Instant Access' : '🔐 Using Strapi Authentication'}
          </p>

          <div className="bg-gray-50 rounded p-3 text-xs text-gray-600">
            <p className="font-semibold mb-2">Demo Credentials:</p>
            <p>Email: editor@newskarnataka.com</p>
            <p>Password: password123</p>

            {!useDemo && (
              <p className="mt-2 text-blue-600">
                Using real Strapi authentication - ensure Strapi is running!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
