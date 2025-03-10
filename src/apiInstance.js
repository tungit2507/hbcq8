import axios from "axios";

const axioInstance = axios.create({
  baseURL: 'https://clbbcduaq8.com/api/v1',
  withCredentials: true,
});

axioInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.data?.status === 401) {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('currentUser');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axioInstance;
