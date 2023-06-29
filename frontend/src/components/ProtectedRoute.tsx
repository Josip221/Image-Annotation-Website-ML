import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth';
import { authContextProps } from '../@interfaces/authContext';
import { useEffect, useCallback } from 'react';

function ProtectedRoute({ children }: any) {
  const { token, expiry, logOut, setError } = useAuth() as authContextProps;

  const navigate = useNavigate();

  const tokenCheck = useCallback(
    (expiry: string) => {
      const currentDateTime = new Date().toISOString();
      const tokenExpiryDateTime = new Date(expiry).toISOString();

      if (currentDateTime > tokenExpiryDateTime) {
        console.log('token expired');
        setError({ message: 'Token expired. Login again' });
        logOut();
        navigate('/login');
      }
    },
    [logOut, navigate, setError]
  );

  const handleVisibilityChange = useCallback(() => {
    if (document.visibilityState === 'visible') {
      tokenCheck(expiry);
    }
  }, [tokenCheck, expiry]);

  useEffect(() => {
    tokenCheck(expiry);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [handleVisibilityChange, tokenCheck, expiry]);

  if (!token) {
    return <Navigate to="/login" />;
  }
  return children;
}

export default ProtectedRoute;
