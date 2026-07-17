import axios from 'axios';

// Default port is 5000 for the GrowLedger Flask API backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 seconds timeout
});

export const predictCreditReadiness = async (payload) => {
  try {
    const response = await api.post('/predict', payload);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getHealthStatus = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

const handleApiError = (error) => {
  if (error.response) {
    // Backend returned an error response (e.g. validation failure)
    return {
      message: error.response.data?.error?.message || 'API request failed.',
      code: error.response.data?.error?.code || 'API_ERROR',
      status: error.response.status,
    };
  } else if (error.request) {
    // Request was made but no response was received
    return {
      message: 'Unable to connect to the backend server. Make sure the Flask API is running on ' + API_BASE_URL,
      code: 'SERVER_UNREACHABLE',
      status: 503,
    };
  } else {
    // Error setting up the request
    return {
      message: error.message || 'An unexpected error occurred.',
      code: 'CLIENT_ERROR',
      status: 400,
    };
  }
};

export default api;
