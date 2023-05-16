import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/auth';
import { authContextProps } from '../@interfaces/authContext';

function ProtectedRoute({ children }: any) {
  const { user } = useAuth() as authContextProps;
  console.log(user);
  if (!user) {
    // user is not authenticated
    return <Navigate to="/login" />;
  }
  return children;
}

export default ProtectedRoute;