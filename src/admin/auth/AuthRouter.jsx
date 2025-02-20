import React from 'react';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
  const isLoggedIn = JSON.parse(sessionStorage.getItem('isLoggedIn'));
  return isLoggedIn ? <Navigate to="/" /> : children;
};

export default PublicRoute;