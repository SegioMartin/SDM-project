import axios from 'axios';

const api = axios.create({
  baseURL: 'http://server:8080/api',
});

export default api;