import axios from 'axios';

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || 'http://103.191.208.235:1337';

// Authentication endpoints
export const authAPI = {
  // Login with email and password
  login: async (email: string, password: string) => {
    try {
      const response = await axios.post(`${STRAPI_URL}/api/auth/local`, {
        identifier: email,
        password,
      });
      return response.data; // { jwt, user }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },

  // Register new user
  register: async (email: string, username: string, password: string) => {
    try {
      const response = await axios.post(`${STRAPI_URL}/api/auth/local/register`, {
        email,
        username,
        password,
      });
      return response.data;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  },

  // Verify token by getting current user
  verifyToken: async (jwt: string) => {
    try {
      const response = await axios.get(`${STRAPI_URL}/api/users/me`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Token verification failed:', error);
      throw error;
    }
  },

  // Logout (client-side only - remove token)
  logout: () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
    localStorage.removeItem('expiresAt');
  },

  // Get stored JWT
  getStoredJWT: (): string | null => {
    return localStorage.getItem('jwt');
  },

  // Get stored user
  getStoredUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Store JWT and user
  storeCredentials: (jwt: string, user: any) => {
    localStorage.setItem('jwt', jwt);
    localStorage.setItem('user', JSON.stringify(user));
    // Set expiration (assume 7 days if not provided)
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    localStorage.setItem('expiresAt', expiresAt);
  },

  // Check if JWT is still valid
  isTokenValid: (): boolean => {
    const jwt = localStorage.getItem('jwt');
    const expiresAt = localStorage.getItem('expiresAt');

    if (!jwt || !expiresAt) return false;

    return new Date() < new Date(expiresAt);
  },

  // Request password reset
  requestPasswordReset: async (email: string) => {
    try {
      const response = await axios.post(`${STRAPI_URL}/api/auth/forgot-password`, {
        email,
      });
      return response.data;
    } catch (error) {
      console.error('Password reset request failed:', error);
      throw error;
    }
  },

  // Reset password with token
  resetPassword: async (code: string, password: string, passwordConfirmation: string) => {
    try {
      const response = await axios.post(`${STRAPI_URL}/api/auth/reset-password`, {
        code,
        password,
        passwordConfirmation,
      });
      return response.data;
    } catch (error) {
      console.error('Password reset failed:', error);
      throw error;
    }
  },
};

// Create authenticated API client
export const createAuthenticatedClient = () => {
  const jwt = authAPI.getStoredJWT();

  return axios.create({
    baseURL: `${STRAPI_URL}/api`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: jwt ? `Bearer ${jwt}` : '',
    },
  });
};
