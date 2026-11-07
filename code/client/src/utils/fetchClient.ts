'use client';

import axios from 'axios';

const SERVER_BASE_URL =
  process.env.NEXT_PUBLIC_SERVER_BASE_URL || 'http://localhost:4242';

const defaultOptions = {
  method: 'get',
  baseURL: SERVER_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
};

const fetchClient = axios.create(defaultOptions);
//override Axios default error message to help surface server errors
fetchClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const { data } = error.response;
      error.message = `Server error: ${data.error.message}`;
      console.log(`Server error: ${error.message}`);
    }
    return Promise.reject(error);
  }
);

export default fetchClient;
