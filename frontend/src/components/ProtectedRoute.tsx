import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/auth';
import { authContextProps } from '../@interfaces/authContext';

function ProtectedRoute({ children }: any) {
  const { token } = useAuth() as authContextProps;
  //console.log(user);
  if (!token) {
    return <Navigate to="/login" />;
  }
  return children;
}

export default ProtectedRoute;
