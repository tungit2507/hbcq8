import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://clbbcduaq8.com',
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if(error.response.data.status == 401){
      localStorage.removeItem('currentUser');
      localStorage.removeItem('isLoggedIn');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
