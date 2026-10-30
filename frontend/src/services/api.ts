import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('move_plus_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Se o backend retornar 401 e não for rota de login/registro, podemos limpar o token
    if (error.response?.status === 401 && !window.location.pathname.includes('/login') && !window.location.pathname.includes('/cadastro')) {
      // localStorage.removeItem('move_plus_token');
    }
    return Promise.reject(error);
  }
);

export default api;
