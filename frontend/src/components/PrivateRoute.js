// ملف: src/components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('access');
  const role = localStorage.getItem('role');

  if (!token || (allowedRoles && !allowedRoles.includes(role))) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
