import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, allowedType }) {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const userType = localStorage.getItem('userType');

  if (!isAuthenticated || userType !== allowedType) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default ProtectedRoute;
