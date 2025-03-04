import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axioInstance from '../../apiInstance';
import { toast, ToastContainer } from 'react-toastify';

const Logout = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (isLoggingOut) return; 
    setIsLoggingOut(true);
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      await axioInstance.get('/logout');      
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Logout failed:', error);
    } finally {
      setIsLoggingOut(false);
      localStorage.setItem("isLoggedIn", false);
      localStorage.removeItem("currentUser");
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