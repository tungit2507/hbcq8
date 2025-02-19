import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axioInstance from '../../apiInstance';
import { toast, ToastContainer } from 'react-toastify';

const Logout = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (isLoggingOut) return; // Ngăn chặn spam logout
    setIsLoggingOut(true);
    try {
      const token = sessionStorage.getItem('token');
      const userId = sessionStorage.getItem('userId');
      await axioInstance.get('/logout', {
        // withCredentials: true,
        headers: {
          'token': token,
          'userId': userId
        }
      });
      
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Logout failed:', error);
    } finally {
      setIsLoggingOut(false);
      sessionStorage.setItem("isLoggedIn", false);
      sessionStorage.removeItem("currentUser");
      navigate("/login")
    
    }
  };

  return (
    <a onClick={handleLogout} disabled={isLoggingOut}>
      {isLoggingOut ? 'Đang đăng xuất...' : 'Đăng Xuất'}
      <ToastContainer />
    </a>
  );
};

export default Logout;