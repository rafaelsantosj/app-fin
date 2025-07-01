// frontend/src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://app-187213420727.us-central1.run.app/api',
});

// Adiciona token de autenticação em cada requisição
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
