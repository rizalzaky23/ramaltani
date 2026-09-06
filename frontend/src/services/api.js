/**
 * Axios API client for RamalTani backend
 */
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ramaltani_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('ramaltani_token');
      localStorage.removeItem('ramaltani_user');
      // Only redirect if not already on auth page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// ─── Auth ──────────────────────────────────────────────────────────────────────
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
};

// ─── Weather ───────────────────────────────────────────────────────────────────
export const weatherAPI = {
  getByRegion: (regionId) => api.get(`/weather/${regionId}`),
  getForecast: (regionId) => api.get(`/weather/${regionId}/forecast`),
  getAlerts: () => api.get('/weather/alerts'),
  getRegions: () => api.get('/weather/regions'),
};

// ─── Recommendations ───────────────────────────────────────────────────────────
export const recommendationsAPI = {
  calculate: (data) => api.post('/recommendations/calculate', data),
  getAll: () => api.get('/recommendations'),
  getRiskMap: () => api.get('/risk-map'),
};

// ─── Crops & Varieties ─────────────────────────────────────────────────────────
export const cropsAPI = {
  getAll: () => api.get('/crops'),
  getVarieties: (cropName) => api.get(`/varieties?cropName=${encodeURIComponent(cropName)}`),
  getVariety: (id) => api.get(`/varieties/${id}`),
};

// ─── Planting History ──────────────────────────────────────────────────────────
export const historyAPI = {
  getAll: () => api.get('/planting-history'),
  create: (data) => api.post('/planting-history', data),
};

// ─── Notifications ─────────────────────────────────────────────────────────────
export const notificationsAPI = {
  getAll: () => api.get('/notifications'),
  markRead: (id) => api.patch(`/notifications/${id}/read`),
  updatePreferences: (prefs) => api.post('/notifications/preferences', prefs),
};

// ─── Community ─────────────────────────────────────────────────────────────────
export const communityAPI = {
  getPosts: (params) => api.get('/community/posts', { params }),
  createPost: (data) => api.post('/community/posts', data),
  getComments: (postId) => api.get(`/community/posts/${postId}/comments`),
  addComment: (postId, content) => api.post(`/community/posts/${postId}/comments`, { content }),
  likePost: (postId) => api.post(`/community/posts/${postId}/like`),
};

// ─── Education ─────────────────────────────────────────────────────────────────
export const educationAPI = {
  getArticles: (params) => api.get('/education', { params }),
  getArticle: (slug) => api.get(`/education/${slug}`),
};

// ─── Analytics ────────────────────────────────────────────────────────────────
export const analyticsAPI = {
  getRegional: () => api.get('/analytics/region'),
};

// ─── Broadcast ────────────────────────────────────────────────────────────────
export const broadcastAPI = {
  getAll: () => api.get('/broadcast'),
  send: (data) => api.post('/broadcast', data),
};

// ─── Admin ────────────────────────────────────────────────────────────────────
export const adminAPI = {
  getUsers: () => api.get('/admin/users'),
  getRegions: () => api.get('/admin/regions'),
  getSystemLogs: () => api.get('/admin/system-logs'),
  getAPIHealth: () => api.get('/admin/api-health'),
};

// ─── Health ───────────────────────────────────────────────────────────────────
export const healthAPI = {
  check: () => api.get('/health'),
};
