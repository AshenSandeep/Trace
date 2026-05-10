import axios from 'axios';

const client = axios.create({
  baseURL: 'https://api.trace.mock',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

client.interceptors.request.use(config => {
  // Auth token would be attached here
  // authStore token is accessed lazily to avoid circular deps
  return config;
});

client.interceptors.response.use(
  response => response,
  error => {
    console.error('[API Error]', error?.response?.status, error?.message);
    return Promise.reject(error);
  },
);

export default client;
