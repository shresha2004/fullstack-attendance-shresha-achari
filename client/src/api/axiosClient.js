import axios from 'axios';

const api = axios.create({
  //For local machine and Docker
  //baseURL: 'http://localhost:5000/api'

  //Deployed backend URL
 baseURL: 'https://fullstack-attendance-shresha-achari-tawny.vercel.app/api'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
