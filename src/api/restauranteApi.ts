import { useRestaurantStore } from '@/pages/Private/Common/store/restaurantStore';
import axios from 'axios';

import { getEnvVariables } from '../helpers';

const { VITE_API_URL } = getEnvVariables();

const restauranteApi = axios.create({
  baseURL: VITE_API_URL,
  //withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptores

restauranteApi.interceptors.request.use((config) => {
  const restaurant = useRestaurantStore.getState().restaurant;
  const token = localStorage.getItem('token');

  config.headers = {
    ...config.headers,
    Authorization: token ? `Bearer ${token}` : undefined
  };

  if (restaurant) {
    config.headers['x-restaurant-id'] = restaurant.id;
  }

  return config;
});

restauranteApi.interceptors.response.use(
  (resp) => resp,
  (err) => {
    // Handle 401 Unauthorized - clear token and redirect to login
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('token-init-date');
      window.location.href = '/auth/login';
    }
    return Promise.reject(err.response);
  }
);

export default restauranteApi;
