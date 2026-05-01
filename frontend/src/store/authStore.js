import { create } from 'zustand';
import api from '../api/axios';

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),

  login: async (username, password) => {
    try {
      const params = new URLSearchParams();
      params.append('username', username);
      params.append('password', password);

      const response = await api.post('/api/auth/login', params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });

      const { access_token } = response.data;
      localStorage.setItem('token', access_token);
      set({ token: access_token, isAuthenticated: true, user: { username } });

      // Толық профайл деректерін жүктеу
      try {
        const profileRes = await api.get('/api/users/me', {
          headers: { Authorization: `Bearer ${access_token}` },
        });
        set({ user: profileRes.data });
      } catch (_) {}

      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || 'Қате логин немесе пароль' };
    }
  },

  register: async (userData) => {
    try {
      await api.post('/api/auth/register', userData);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || 'Қате' };
    }
  },

  fetchProfile: async () => {
    try {
      const response = await api.get('/api/users/me');
      set({ user: response.data });
      return response.data;
    } catch (error) {
      return null;
    }
  },

  updateProfile: async (data) => {
    try {
      const response = await api.put('/api/users/me', data);
      set({ user: response.data });
      return { success: true, user: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || 'Қате' };
    }
  },

  updatePassword: async (currentPassword, newPassword) => {
    try {
      await api.put('/api/users/me/password', {
        current_password: currentPassword,
        new_password: newPassword,
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || 'Қате' };
    }
  },

  logout: () => {
    // Backend-те cookie тазалау
    api.post('/api/auth/logout').catch(() => {});
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
  },
}));

export default useAuthStore;
