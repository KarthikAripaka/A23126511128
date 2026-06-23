import axios from 'axios';
import { logger } from '../middleware/logger';
import { API_BASE_URL } from '../utils/constants';

const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJhcmlwYWtha2FydGhpay4yMy5pdEBhbml0cy5lZHUuaW4iLCJleHAiOjE3ODIxOTk3NzAsImlhdCI6MTc4MjE5ODg3MCwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6IjhlMjk1MTFhLTg1ZGMtNDg1ZS1hMzI3LTI2MDhkNjgyZmRkZiIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6ImthcnRoaWsgYXJpcGFrYSIsInN1YiI6IjU1ZWU3ZmM0LTZlZDItNGIyZC05ZGZmLTY3ZDE5NGIwNWUwZSJ9LCJlbWFpbCI6ImFyaXBha2FrYXJ0aGlrLjIzLml0QGFuaXRzLmVkdS5pbiIsIm5hbWUiOiJrYXJ0aGlrIGFyaXBha2EiLCJyb2xsTm8iOiJhMjMxMjY1MTExMjgiLCJhY2Nlc3NDb2RlIjoiTVRxeGFyIiwiY2xpZW50SUQiOiI1NWVlN2ZjNC02ZWQyLTRiMmQtOWRmZi02N2QxOTRiMDVlMGUiLCJjbGllbnRTZWNyZXQiOiJ5YVFGclN1c3R1UHB5RGhwIn0.wIAVbyJOHzoJTY5itOL55JiN898o0ghHU_-03vjSfDU';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    if (AUTH_TOKEN) {
      config.headers.Authorization = `Bearer ${AUTH_TOKEN}`;
    }
    logger.info('API request initiated', {
      method: config.method?.toUpperCase(),
      url: config.url,
      params: config.params,
    });
    return config;
  },
  (error) => {
    logger.error('API request failed', { error: error.message });
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    logger.info('API response received', {
      url: response.config.url,
      status: response.status,
      dataSize: JSON.stringify(response.data).length,
    });
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;
    logger.error('API response error', {
      url: error.config?.url,
      status,
      message,
    });
    return Promise.reject(error);
  }
);

export const fetchNotifications = async () => {
  const response = await api.get('/notifications');
  return response.data;
};

export default api;
