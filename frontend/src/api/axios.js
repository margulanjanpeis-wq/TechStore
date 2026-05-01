import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // cookie жіберу үшін (refresh_token)
});

// ── Request interceptor: access token қосу ────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor: 401 болса автоматты refresh ─────────
let isRefreshing = false;
let failedQueue  = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401 қатесі + бұрын retry жасалмаған + refresh endpoint емес
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/api/auth/refresh') &&
      !originalRequest.url?.includes('/api/auth/login')
    ) {
      if (isRefreshing) {
        // Басқа сұраныс refresh күтіп тұр — кезекке қосу
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }).catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Refresh token cookie арқылы жаңа access token алу
        const res = await axios.post(
          `${API_URL}/api/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newToken = res.data.access_token;
        localStorage.setItem('token', newToken);
        api.defaults.headers.common.Authorization = `Bearer ${newToken}`;

        processQueue(null, newToken);

        // Бастапқы сұранысты қайталау
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh token да жарамсыз → шығару
        processQueue(refreshError, null);
        localStorage.removeItem('token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
